FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN bun install --ignore-scripts

FROM base AS builder
COPY package.json package-lock.json* ./
RUN bun install --ignore-scripts
COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 bunuser
RUN adduser --system --uid 1001 bunuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env ./

RUN apt-get update && apt-get install -y nodejs npm
RUN npm rebuild bcrypt

RUN chown -R bunuser:bunuser /app
USER bunuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun eval "import http from 'node:http'; http.get('http://localhost:3000/', res => process.exit(res.statusCode === 200 ? 0 : 1))"

CMD ["bun", "run", "start"]

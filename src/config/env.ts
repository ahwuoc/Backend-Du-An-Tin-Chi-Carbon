const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`FATAL: Enviroment variable ${key} is missing`);
    }
    return value || defaultValue || "";
}

export const config = {
    // Server
    PORT: parseInt(getEnvVar("PORT", "3000"), 10),
    NODE_ENV: getEnvVar("NODE_ENV", "development"),

    // Database
    MONGO_URI: getEnvVar("MONGO_URI"),

    // JWT
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "7d"),

    // Email
    SMTP_HOST: getEnvVar("SMTP_HOST"),
    SMTP_PORT: parseInt(getEnvVar("SMTP_PORT", "587"), 10),
    SMTP_USER: getEnvVar("SMTP_USER"),
    SMTP_PASS: getEnvVar("SMTP_PASS"),

    // Frontend
    FRONTEND_URL: getEnvVar("FRONTEND_URL", "http://localhost:3000"),

    // CORS
    CORS_ORIGIN: getEnvVar("CORS_ORIGIN", "http://localhost:3000"),
};
export const validateConfig = (): void => {
    try {
        Object.values(config);
    } catch (error) {
        console.error(`Config validation faild`,error)
        process.exit(1);
    }
}
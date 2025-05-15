import News from '../models/news';
import { INews } from '../types/news';
import { generateSlug } from '../utils/slugify';

class NewsService {
  async createNews(data: Partial<INews>, userId: string) {
    const slug = generateSlug(data.title!);
    const news = new News({ ...data, slug, author: userId });
    return await news.save();
  }

  async updateNews(id: string, data: Partial<INews>) {
    if (data.title) {
      data.slug = generateSlug(data.title);
    }
    return await News.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteNews(slug: string) {
    return await News.findOneAndDelete({ slug });
  }

  async getNewsBySlug(slug: string) {
    return await News.findOne({ slug }).populate('author', 'name');
  }

  async getNewsList(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const news = await News.find()
      .populate('author', 'name')
      .skip(skip)
      .limit(limit);
    const total = await News.countDocuments();
    return { news, total, page, limit };
  }
}

export default new NewsService();
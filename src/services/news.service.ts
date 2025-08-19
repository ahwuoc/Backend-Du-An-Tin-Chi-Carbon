import News from "../models/news.model";

export interface INewsData {
  title: string;
  content: string;
  userId: string;
  category: string;
  status?: string;
  image?: string;
  tags?: string[];
}

export interface INewsService {
  getAllNews(): Promise<any[]>;
  getNewsById(id: string): Promise<any | null>;
  createNews(newsData: INewsData): Promise<any>;
  updateNews(id: string, newsData: Partial<INewsData>): Promise<any | null>;
  deleteNews(id: string): Promise<boolean>;
  validateNewsData(newsData: INewsData): string[];
}

export class NewsService implements INewsService {
  public async getAllNews(): Promise<any[]> {
    return await News.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name");
  }

  public async getNewsById(id: string): Promise<any | null> {
    return await News.findById(id);
  }

  public async createNews(newsData: INewsData): Promise<any> {
    const newNews = new News(newsData);
    return await newNews.save();
  }

  public async updateNews(
    id: string,
    newsData: Partial<INewsData>,
  ): Promise<any | null> {
    return await News.findByIdAndUpdate(id, newsData, {
      new: true,
      runValidators: true,
    });
  }

  public async deleteNews(id: string): Promise<boolean> {
    const result = await News.findByIdAndDelete(id);
    return !!result;
  }

  public validateNewsData(newsData: INewsData): string[] {
    const errors: string[] = [];

    if (!newsData.title) {
      errors.push("Tiêu đề là bắt buộc");
    }

    if (!newsData.content) {
      errors.push("Nội dung là bắt buộc");
    }

    if (!newsData.userId) {
      errors.push("ID người dùng là bắt buộc");
    }

    if (!newsData.category) {
      errors.push("Danh mục là bắt buộc");
    }

    return errors;
  }
}

export default new NewsService();

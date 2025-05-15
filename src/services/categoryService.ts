import Category from '../models/category';
import { ICategory } from '../types/category';

class CategoryService {
  // Tạo mới một danh mục
  async createCategory(data: ICategory) {
    try {
      const category = new Category(data);
      return await category.save();
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  // Lấy tất cả danh mục
  async getCategories() {
    try {
      return await Category.find();
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }

  // Lấy danh mục theo ID
  async getCategoryById(categoryId: string) {
    try {
      return await Category.findById(categoryId);
    } catch (error) {
      throw new Error(`Error fetching category by ID: ${error.message}`);
    }
  }

  // Cập nhật danh mục
  async updateCategory(categoryId: string, data: Partial<ICategory>) {
    try {
      return await Category.findByIdAndUpdate(categoryId, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  // Xóa danh mục
  async deleteCategory(categoryId: string) {
    try {
      return await Category.findByIdAndDelete(categoryId);
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }
}

export default new CategoryService();

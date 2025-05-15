export interface INews {
    title: string;
    slug: string;
    content: string;
    image?: string;
    seo_title?: string;
    seo_description?: string;
    status: 'draft' | 'published' | 'archived';
    author: string;
  }
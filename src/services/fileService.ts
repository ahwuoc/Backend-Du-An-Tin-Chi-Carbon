import { createClient } from '../utils/supabase';

class FileService {
  async uploadFile(file: Express.Multer.File, bucket: string) {
    const supabase = createClient();
    const fileName = `${Date.now()}_${file.originalname}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) throw new Error(`Error uploading file: ${error.message}`);
    return supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl;
  }
}

export default new FileService();
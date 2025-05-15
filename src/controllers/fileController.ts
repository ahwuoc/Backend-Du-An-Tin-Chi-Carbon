import { Request, Response } from 'express';
import FileService from '../services/fileService';

class FileController {
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      const url = await FileService.uploadFile(req.file, 'carbon-uploads');
      res.status(200).json({ url });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new FileController();
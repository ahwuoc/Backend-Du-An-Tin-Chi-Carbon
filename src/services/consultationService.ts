import Consultation from '../models/consultation';
import { IConsultation } from '../types/consultation';

class ConsultationService {
  async registerConsultation(data: Partial<IConsultation>, userId: string) {
    const consultation = new Consultation({ ...data, user: userId });
    return await consultation.save();
  }
}

export default new ConsultationService();
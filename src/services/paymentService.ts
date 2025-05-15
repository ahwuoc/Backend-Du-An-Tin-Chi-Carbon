import Payment from '../models/payment';
import { IPayment } from '../types/payment';

class PaymentService {
  async createPayment(data: Partial<IPayment>, userId: string) {
    const payment = new Payment({ ...data, user: userId, transactionId: `TXN_${Date.now()}` });
    return await payment.save();
  }

  async confirmPayment(id: string, status: 'completed' | 'failed') {
    return await Payment.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export default new PaymentService();
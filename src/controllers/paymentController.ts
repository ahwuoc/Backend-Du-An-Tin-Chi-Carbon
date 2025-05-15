import { Request, Response } from 'express';
import PaymentService from '../services/paymentService';

class PaymentController {
  async createPayment(req: Request, res: Response) {
    try {
      const payment = await PaymentService.createPayment(req.body, req.user!.id);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async confirmPayment(req: Request, res: Response) {
    try {
      const payment = await PaymentService.confirmPayment(req.params.id, req.body.status);
      if (!payment) return res.status(404).json({ message: 'Payment not found' });
      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new PaymentController();
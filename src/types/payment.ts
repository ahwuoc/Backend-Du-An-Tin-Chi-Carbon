export interface IPayment {
    user: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: string;
    transactionId?: string;
  }
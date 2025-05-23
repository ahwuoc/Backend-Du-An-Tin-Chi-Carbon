interface IDonation extends Document {
  name: string;
  email: string;
  phone?: string;
  quantity: number;
  note?: string;
  userId: string;
  treeCount: number;
  totalAmount?: number;
  createdAt?: Date;
}
export default IDonation;

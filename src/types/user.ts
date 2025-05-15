export interface IUser {
  _id?: string; // Optional khi tạo mới
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

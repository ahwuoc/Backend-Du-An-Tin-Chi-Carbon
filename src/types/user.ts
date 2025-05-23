interface IUser {
  email: string;
  password: string;
  name: string;
  role?: "user" | "admin" | "editor";
  avatar?: string;
  phone?: string;
  address?: string;
  provider?: "local" | "google";
  ref?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export default IUser;

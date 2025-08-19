export interface ICertificate {
  name: string;
  type: "international_certificates";
  description: string;
  purchaseDate: Date;
  expiryDate: Date;
  status: "active" | "expired";
  image?: string;
  certificateImage?: string;
  features: string[];
  customFeatureName?: string;
  price: number;
  certificationLevel: "Nghiên cứu" | "Chuyên gia";
  courseProgress?: number;
  lastAccessed?: Date;
  issuer?: string;
  progressStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICertificateCreate {
  name: string;
  type: "international_certificates";
  description: string;
  purchaseDate: Date;
  expiryDate: Date;
  status: "active" | "expired";
  image?: string;
  certificateImage?: string;
  features?: string[];
  customFeatureName?: string;
  price: number;
  certificationLevel: "Nghiên cứu" | "Chuyên gia";
  courseProgress?: number;
  lastAccessed?: Date;
  issuer?: string;
}

export interface ICertificateUpdate {
  name?: string;
  description?: string;
  purchaseDate?: Date;
  expiryDate?: Date;
  status?: "active" | "expired";
  image?: string;
  certificateImage?: string;
  features?: string[];
  customFeatureName?: string;
  price?: number;
  certificationLevel?: "Nghiên cứu" | "Chuyên gia";
  courseProgress?: number;
  lastAccessed?: Date;
  issuer?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'sinalizacao' | 'serigrafia' | 'comunicacao' | 'adesivos';
  description: string;
  image: string;
  priceEstimate?: string;
  features: string[];
}

export interface Service {
  id: string;
  name: string;
  category: 'sinalizacao' | 'serigrafia' | 'comunicacao' | 'adesivos';
  description: string;
  image: string;
  features: string[];
}

export interface BudgetItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  width?: number; // in cm
  height?: number; // in cm
  observations?: string;
}

export interface BudgetRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  items: BudgetItem[];
  status: 'pending' | 'review' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  notes?: string;
  totalEstimate?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  avatar?: string;
}

export interface CompanySettings {
  name: string;
  phone: string;
  phoneFormatted: string;
  phoneLandline?: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  locationUrl: string;
  latitude: number;
  longitude: number;
}

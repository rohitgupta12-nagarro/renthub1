export type PropertyType = 'Apartment' | 'Independent House' | 'Villa' | 'Studio' | 'Penthouse';
export type StayType = 'Long term (6+ months)' | 'Short term' | 'Both';
export type PriceMode = 'Per Month' | 'Utilities included in rent';
export type VegPreference = 'Vegetarian Only' | 'Non-Vegetarian' | 'Any';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ContactInfo {
  landlordName: string;
  phone: string;
  email: string;
}

export interface Apartment {
  id: string;
  title: string;
  buildingName: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  isShared: boolean;
  address: Address;
  squareFeet: number;
  stayType: StayType;
  rent: number;
  isNegotiable: boolean;
  priceMode: PriceMode;
  isFurnished: boolean;
  vegPreference: VegPreference;
  amenities: string[];
  description: string;
  photos: string[];
  contact: ContactInfo;
  landlordId: string;
  isFeatured?: boolean;
  createdAt: string;
  viewsCount?: number;
}

export const AVAILABLE_AMENITIES: string[] = [
  'Gym/Fitness Center',
  'Swimming Pool',
  'Car Park',
  'Visitors Parking',
  'Power Backup',
  'Garbage Disposal',
  'Private Lawn',
  'Water Heater',
  'Plant Security System',
  'Laundry Service',
  'Elevator',
  'Club House'
];


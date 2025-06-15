export interface Patient {
  id?: number;
  name: string;
  dob: string; // Using string for simplicity with date inputs
  bloodGroup: string;
  gender: string;
  phone: string;
  address: string;
  insuranceType: string;
}

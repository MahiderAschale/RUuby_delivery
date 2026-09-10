import { api } from "./api";

export interface Address {
  id: string;
  userId: string;
  label: string;
  address: string;
  city: string;
  subCity?: string | null;
  phone?: string | null;
  latitude: number | string;
  longitude: number | string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface GetAddressesResponse {
  success: boolean;
  data: {
    addresses: Address[];
  };
}

interface CreateAddressResponse {
  success: boolean;
  message: string;
  data: {
    address: Address;
  };
}

export interface CreateAddressData {
  label: string;
  address: string;
  city: string;
  subCity?: string;
  phone?: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export const getAddresses = async (): Promise<Address[]> => {
  const response = await api.get<GetAddressesResponse>(
    "/addresses",
  );

  return response.data.data.addresses;
};

export const createAddress = async (
  data: CreateAddressData,
): Promise<Address> => {
  const response = await api.post<CreateAddressResponse>(
    "/addresses",
    data,
  );

  return response.data.data.address;
};
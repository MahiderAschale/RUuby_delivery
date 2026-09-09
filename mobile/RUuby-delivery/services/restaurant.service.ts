import { api } from "./api";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  phone: string;
  email?: string | null;
  address: string;
  city: string;
  subCity?: string | null;
  latitude: number | string;
  longitude: number | string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  status: string;
  isOpen: boolean;
}

interface GetRestaurantsResponse {
  success: boolean;
  data: {
    restaurants: Restaurant[];
  };
}

export const getRestaurants = async (): Promise<
  Restaurant[]
> => {
  const response =
    await api.get<GetRestaurantsResponse>(
      "/restaurants",
    );

  return response.data.data.restaurants;
};
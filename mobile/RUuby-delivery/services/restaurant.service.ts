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



interface GetRestaurantResponse {
  success: boolean;
  data: {
    restaurant: RestaurantDetail;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  imageUrl?: string | null;
  isAvailable: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  items: MenuItem[];
}

export interface RestaurantDetail extends Restaurant {
  categories: MenuCategory[];
}

export const getRestaurantBySlug = async (
  slug: string,
): Promise<RestaurantDetail> => {
  const response =
    await api.get<GetRestaurantResponse>(
      `/restaurants/${slug}`,
    );

  return response.data.data.restaurant;
};
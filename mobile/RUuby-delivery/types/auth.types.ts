export interface LoginRequest {
    phone: string;
    password: string;
  }
  
  export interface RegisterRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    password: string;
  }
  
  export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string | null;
    role: "CUSTOMER" | "RESTAURANT_OWNER" | "RIDER" | "ADMIN";
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
      accessToken: string;
      user: AuthUser;
    };
  }
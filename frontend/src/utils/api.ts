import axios from "axios";

// const API_URL ="http://localhost:8000/api";
const API_URL= process.env.NEXT_PUBLIC_API_URL

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};


export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      config
    );

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signUpUser = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Signup error:", error.message);
    throw error;
  }
};

export const fetchProducts = async (
  page: number = 1,
  category: string = "",
  search: string = "",
  limit: number = 9
) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: { page, category, search, limit },
      ...config
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/categories`,config);
    return response.data; 
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


export const fetchProductById = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`,config);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
};

  export const addToCartApi = async (productId: string, quantity: number) => {
    try {
      const response = await axios.post(`${API_URL}/cart/add`, {
        productId,
        quantity,
      },config);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };
  
  // Remove product from cart
  export const removeFromCartApi = async (productId: string) => {
    try {
      const response = await axios.post(`${API_URL}/cart/remove`, {productId},config);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  //   export const fetchCart = async (userId: string): Promise<CartResponse> => {
  export const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/view`, 
      config);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  };

  export const checkout = async () => {
    try {
      const response = await axios.post(`${API_URL}/orders/checkout`, {},config);
      return response.data; 
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  };


  export const getUserOrders = async (orderId: string): Promise<{ success: boolean; order: any }> => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`,config);
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error
    }
  };


  export const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/history`,config);
      return response.data;
    } catch (error) {
      console.error("Error fetching order history:", error);
      throw error;
    }
  };


  export const fetchLast7DaysRevenue = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/revenue-stats`,config);
      return response.data;
    } catch (error:any) {
      console.error("Error fetching last 7 days revenue:", error.message);
      throw error;
    }
  };
  
  // Fetch top spenders
  export const fetchTopSpenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/top-senders`,config);
      return response.data;
    } catch (error:any) {
      console.error("Error fetching top spenders:", error.message);
      throw error;
    }
  };
  
  // Fetch sales by category
  export const fetchSalesByCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/sales-by-category`,config);
      return response.data;
    } catch (error:any) {
      console.error("Error fetching sales by category:", error.message);
      throw error;
    }
  };





  export const checkAuthentication = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth`,config);
      return response.data;
    } catch (error) {
      console.error("Error fetching top spenders:", error);
      return null;
    }
  };

  export const logout = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {},config);
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      return null;
    }
  };


  
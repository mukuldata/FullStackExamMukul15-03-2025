
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
  }
  
  export interface ProductResponse {
    total: number;
    page: number;
    limit: number;
    products: Product[];
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  


  export interface RevenueEntry {
    date: string;
    totalRevenue: number;
  }
  
  export interface Last7DaysRevenueResponse {
    success: boolean;
    message: string;
    last7DaysRevenue: RevenueEntry[];
  }
  
  export interface User {
    name: string;
    email: string;
  }
  
  export interface Spender {
    userId: string;
    totalSpent: number;
    User: User;
  }
  
  export interface TopSpendersResponse {
    success: boolean;
    message: string;
    topSpenders: Spender[];
  }
  
  export interface SalesCategory {
    category: string;
    totalUnitsSold: number;
    totalRevenue: number;
  }
  
  export interface SalesByCategoryResponse {
    success: boolean;
    message: string;
    data: SalesCategory[];
  }
  
import { ReactNode } from "react";
import { Product } from "./cart";

export interface Order {
  total: ReactNode;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  products: OrderProduct[];
  date: Date;
}

export interface IOrderContextType {
  orders: Order[];
  addOrder: (newOrder: Order) => void;
  loadOrders: () => void;
}

export interface OrderProduct {
  product: Product;
  quantity: number;
}

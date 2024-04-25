export interface Product {
  _id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
export interface ICartContext {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (product_id: string) => void;
  user: IUser;
  setUser: (user: IUser) => void;
  clearCart: () => void;
}

export interface IUser {
  email: string;
}

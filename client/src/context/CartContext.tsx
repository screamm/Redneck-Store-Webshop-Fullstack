import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Product, CartItem, ICartContext, IUser } from "../models/cart";

export const initialValues = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  user: { email: "" },
  setUser: () => {},
  clearCart: () => {},
};

const CartContext = createContext<ICartContext>(initialValues);
export const useCart = () => useContext(CartContext);



const CartProvider = ({ children }: PropsWithChildren<any>) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const lsCart = localStorage.getItem("cart");
    return lsCart ? JSON.parse(lsCart) : [];
  });

  const [user, setUser] = useState<IUser>({ email: "" });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const clonedCart = [...cart];
    const existingItem = clonedCart.find(
      (item) => item.product._id === product._id
    );
    if (existingItem) {
      existingItem.quantity++;
      setCart(clonedCart);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => {
      const itemExists = currentCart.find(
        (item) => item.product._id === productId
      );
      if (itemExists && itemExists.quantity > 1) {
        return currentCart.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return currentCart.filter((item) => item.product._id !== productId);
      }
    });
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        user,
        setUser,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
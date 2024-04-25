import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "../Router.tsx";
import CartProvider from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <div className=" bg-redneckbg ">
    <RouterProvider router={router} />
    </div>
  </CartProvider>
);

import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./src/pages/NotFound";
// import { Home } from "./src/pages/Home";
import { Cancellation } from "./src/pages/Cancellation";
import { Confirmation } from "./src/pages/Confirmation";
import { Store } from "./src/pages/Store";
import { Admin } from "./src/pages/Admin";
import { LoginPage } from "./src/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,

    children: [
      {
        path: "/",
        element: <Store />,
        index: true,
      },
      {
        path: "/admin",
        element: <Admin />,
        
      },
      {
        path: "/loginpage",
        element: <LoginPage />,
        
      },
      {
        path: "/confirmation",
        element: <Confirmation />,
      },
      {
        path: "/cancellation",
        element: <Cancellation />,
      },
    ],
  },
]);

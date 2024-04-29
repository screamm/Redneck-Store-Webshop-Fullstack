import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo redneck.png";
import AdminEdit from "../components/AdminEdit";

export const Admin = () => {
  // const [user, setUser] = useState<string>("");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

// console.log("User:", user);

  const goToShopping = () => {
    navigate("/");
  };

  // useEffect(() => {
  //   const authorize = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3000/auth/authorize", {
  //         credentials: "include",
  //       });
  //       if (!response.ok) {
  //         throw new Error(`Server response: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setUser(data);
  //     } catch (error: any) {
  //       console.error("Authorization-error:", error.message);
  //       setUser("");
  //     }
  //   };
  //   authorize();
  // }, []);

  const fetchOrders = async () => {
    console.log("Fetching orders..please wait");
    try {
      const response = await fetch("http://localhost:3000/orders");
      if (!response.ok) {
        throw new Error("ERROR: Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data || []);
      console.log("Fetched orders:", data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div className="flex flex-col items-center bg-redneckbg min-h-screen"> {/* Adjusted for minimum screen height and centered items */}
      {isLoggedIn ? (
        <>
          <div className="w-full max-w-4xl mx-auto pt-8"> {/* Centering and limiting width, adding padding on top */}
            <img src={logo} alt="Logo" className="w-1/3 mx-auto" />

<AdminEdit />


            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4"
              onClick={fetchOrders}
            >
              Get all orders
            </button>
  
            <ul className="w-full"> {/* Full width to manage the nested flex items */}
              {orders.map((order: any) => (
                <li key={order._id} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-fit">
                  <div>
                    Customer: {order.linkedCustomerEmail || 'No customer email'}
                    <br />
                    Order date: {order.orderDate}
                    <br />
                    <p className="text-white font-bold">Status: {order.status}</p>
                    <br />
                    <p>Products:</p>
                    <ul>
                      {order.lineItems.map((item: any) => (
                        <li key={item._id}>
                          Product: {item.product.name} - Amount: {item.amount}x
                        </li>
                      ))}
                    </ul>
                    <br />
                    Total price: {order.totalPrice}:-
                  </div>
                </li>
              ))}
            </ul>
          </div>
  
          <button
            onClick={goToShopping}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16" // Moved out of the flex container, adjusted margins
          >
            BACK TO ROOT
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>PLEASE LOGIN</p>
        </div>
      )}
    </div>
  );
  
};

export default Admin;
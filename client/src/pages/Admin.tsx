import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo redneck.png";


export const Admin = () => {
  const [user, setUser] = useState<string>("");
//   const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  const goToShopping = () => {
    navigate("/");
  };

  console.log("User:", user);

  useEffect(() => {
    const authorize = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/authorize", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Server response: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
      } 
        catch (error: any) {
        console.error("Authorization-error:", error.message);
        setUser("");
      }
    };
    authorize();
  }, []);

  


const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      const fetchOrders = async () => {
        console.log("Fetching orders..please wait");
        try {
          const response = await fetch("http://localhost:3000/orders");
          console.log("Server response ", response.status);
          if (!response.ok) {
            
            throw new Error("ERROR: Failed to fetch orders");
          }
          // console.log("Server response ", response.status);
  
          const data = await response.json();
          // console.log("Fetched products:", data);
          setOrders(data || []);
          console.log("Fetched orders:", data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      };
  
      fetchOrders();
         
    }
    , []);

    const allOrders = () => {
      console.log("Orders:", orders);
    };

  interface order
  {
    _id: string;
    customer: string;
    lineItems: string;
    orderDate: Date;
    status: string;
    totalPrice: number;
  }

  
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// return (
//   <div className="flex flex-col items-center justify-center bg-redneckbg h-screen">
//     {isLoggedIn ? (
//       <>
//         <div>
//           <img src={logo} alt="Logo" className="w-1/3" />

//           <ul>
//             <button
//               className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//               onClick={allOrders}
//             >
//               Get all orders
//             </button>
//             {orders.map((order: order) => (
//               <li key={order._id}>{order.customer}</li>
//             ))}
//           </ul>


//         </div>

//         <div>
//           <button
//             onClick={goToShopping}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             BACK TO ROOT
//           </button>
//         </div>
//       </>
//     ) : (
//       <div className="flex flex-col items-center justify-center bg-redneckbg h-screen">
//         <p>PLEASE LOGIN</p>
//       </div>
//     )}
//   </div>
// );

return (
  <div className="flex flex-col items-center justify-center bg-redneckbg h-screen">
    {isLoggedIn ? (
      <>
        <div>
          <img src={logo} alt="Logo" className="w-1/3" />
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={allOrders}
          >
            Get all orders
          </button>
          <ul>
            {orders.map((order: order) => (
              <li key={order._id}>
                {order.customer && typeof order.customer === 'object' ?
                  `${order.customer || 'Förnamn saknas'} ${order.customer.lastName || 'Efternamn saknas'}` :
                  'Kundinformation saknas'
                }
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button
            onClick={goToShopping}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            BACK TO ROOT
          </button>
        </div>
      </>
    ) : (
      <div className="flex flex-col items-center justify-center">
        <p>PLEASE LOGIN</p>
      </div>
    )}
  </div>
);



};

export default Admin;
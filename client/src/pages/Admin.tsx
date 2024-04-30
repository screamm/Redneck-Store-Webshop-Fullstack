import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo redneck.png";
import AdminEdit from "../components/AdminEdit";
import AddProduct from "../components/AddProduct"; // Import the AddProduct component


export const Admin = () => {
  // const [user, setUser] = useState<string>("");
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);  // State to toggle order visibility

  const navigate = useNavigate();

// console.log("User:", user);

  const goToShopping = () => {
    navigate("/");
  };




  const fetchOrders = async () => {
    if (!showOrders) {
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
    } else {
      setOrders([]);  // Clear orders when hiding them
    }
    setShowOrders(!showOrders);  // Toggle the showOrders state
  };




  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";


  const deleteOrder = async (orderId) => {
    try {
        const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to delete the order");
        alert("Order deleted successfully!");
        fetchOrders();  // Assume this function fetches all orders and updates the state
    } catch (error) {
        console.error("Failed to delete order:", error);
        alert("Failed to delete order: " + error.message);
    }
};



return (
  <div className="flex flex-col items-center bg-redneckbg min-h-screen">
    {isLoggedIn ? (
      <>
        <div className="w-full max-w-4xl mx-auto pt-8">
          <img src={logo} alt="Logo" className="w-1/3 mx-auto" />
          <AdminEdit />
          <AddProduct /> {/* Include the AddProduct component */}

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4"
            onClick={fetchOrders}
          >
            {showOrders ? "Hide all orders" : "Show all orders"}
          </button>
          {showOrders && (
            <ul className="w-full">
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
                  <br />
                  <button onClick={() => deleteOrder(order._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete Order
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={goToShopping}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16"
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



  // const fetchOrders = async () => {
  //   console.log("Fetching orders..please wait");
  //   try {
  //     const response = await fetch("http://localhost:3000/orders");
  //     if (!response.ok) {
  //       throw new Error("ERROR: Failed to fetch orders");
  //     }
  //     const data = await response.json();
  //     setOrders(data || []);
  //     console.log("Fetched orders:", data);
  //   } catch (error) {
  //     console.error("Failed to fetch orders:", error);
  //   }
  // };
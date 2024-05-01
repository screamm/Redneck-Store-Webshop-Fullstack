import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo redneck.png";
import AdminEdit from "../components/AdminEdit";
import AddProduct from "../components/AddProduct"; 


export const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false); 

  const navigate = useNavigate();


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
      setOrders([]);  
    }
    setShowOrders(!showOrders);  
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
        fetchOrders();  
    } catch (error) {
        console.error("Failed to delete order:", error);
        alert("Failed to delete order: " + error.message);
    }
};


return (
  <div className="flex flex-col bg-redneckbg min-h-screen border-8 border-black">
    {isLoggedIn ? (
      <>
        <div className="w-screen pt-8 border-4 border-black">
          <img src={logo} alt="Logo" className="w-1/4 mx-auto border-4 border-black" />
          <div className="flex flex-col items-center justify-center mt-4 border-4 border-black">
          <div className="flex flex-row items-center justify-evenly mt-4 border-4  border-pink-600 w-screen">
            <AdminEdit />
            <AddProduct />
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4"
              onClick={fetchOrders}
            >
              {showOrders ? "Hide all orders" : "Show all orders"}
            </button>
            </div>
            {showOrders && (
              <div className="flex mr-56 self-end">
              <ul className="w-full px-4   ">
                {orders.map((order: any) => (
                  <li key={order._id} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-96">
                    <div className="flex flex-col items-center">
                      <div className="text-left">
                        Customer: {order.linkedCustomerEmail || 'No customer email'}
                        <br />
                        Order date: {order.orderDate}
                        <br />
                        <br />
                        <p className="text-white font-bold">Status: {order.status}</p>
                        <br />
                        <p>Products:</p>
                        <ul>
                          {order.lineItems.map((item: any) => (
                            <li key={item._id}>
                              {item.product && item.product.name ? item.product.name : "Product name not available"} - Amount: {item.amount}x
                            </li>
                          ))}
                        </ul>
                        <br />
                        Total price: {order.totalPrice}:
                      </div>
                      <button onClick={() => deleteOrder(order._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
                        Delete Order
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={goToShopping}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 mx-auto"
        >
          BACK TO STORE
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
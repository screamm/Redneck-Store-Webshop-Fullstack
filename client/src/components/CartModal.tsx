import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { BsTrash3Fill } from "react-icons/bs";

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const isLoggedIn = localStorage.getItem("user");
  const totalCost = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  useEffect(() => {
    const newTotalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    setTotalQuantity(newTotalQuantity);
  }, [cart]);

  const handlePayment = async () => {
    if (!isLoggedIn && !email) {
      setEmailError('Please enter your email to proceed with the payment');
      return;
    }

    const user = isLoggedIn ? JSON.parse(localStorage.getItem("user")) : { email: email };
    const cartForMongo = {
      lineItems: cart.map((item) => ({
        product: item.product._id,
        amount: item.quantity,
        totalPrice: item.product.price * item.quantity,
      })),
      email: user.email,
      status: "paid",
      totalPrice: totalCost
    };

    try {
      const response = await fetch("http://localhost:3000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartForMongo),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Order created successfully", data);
        localStorage.setItem("sessionId", JSON.stringify(data.sessionId));
        clearCart();
        window.location.href = "/Confirmation";
      } else {
        console.error("Failed to create order", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={isOpen ? "fixed top-0 right-0 w-96 h-screen bg-emerald-100 p-5 shadow-lg overflow-y-auto z-50" : "hidden"}>
      {!isLoggedIn && (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            placeholder="Enter email for payment"
            className="p-2 w-full mb-4"
          />
          {emailError && <p className="text-red-500">{emailError}</p>}
        </>
      )}
      <div className="mt-6">
        <ul>
          {cart.map((item) => (
            <li key={item.product._id} className="flex items-center justify-between mb-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 mr-4"
              />
              <span>{item.product.name} - Amount: {item.quantity}</span>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="bg-red-500 hover:bg-red-700 text-white rounded-full p-2 transition duration-150 ease-in-out"
              >
                <BsTrash3Fill />
              </button>
            </li>
          ))}
        </ul>
        <div>Total Items: {totalQuantity}</div>
        <div className="text-lg font-semibold">Total Cost: {totalCost} SEK</div>
        <div className="flex justify-center mt-4">
          <button onClick={handlePayment} className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded shadow cursor-pointer transition duration-150 ease-in-out">
            PAY NOW
          </button>
        </div>
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150 ease-in-out mt-20">
          Close
        </button>
      </div>
    </div>

  );

}




export default CartModal;




// import { useState, useEffect } from "react";
// import { useCart } from "../context/CartContext";
// import { BsTrash3Fill } from "react-icons/bs";
// import { Confirmation } from "../pages/Confirmation";

// const CartModal = ({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) => {
//   const { cart, removeFromCart } = useCart();
//   const { clearCart } = useCart();
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const totalCost = cart.reduce(
//     (total, item) => total + item.product.price * item.quantity,
//     0
//   );

//   useEffect(() => {
//     const newTotalQuantity = cart.reduce(
//       (total, item) => total + item.quantity,
//       0
//     );
//     setTotalQuantity(newTotalQuantity);
//   }, [cart]);


//   const handlePayment = async () => {
//     const user = JSON.parse(localStorage.getItem("user") as string);
//     const cartForMongo = {
//         lineItems: cart.map((item) => ({
//             product: item.product._id,
//             amount: item.quantity,
//             totalPrice: item.product.price * item.quantity
//         })),
//         email: user.email,
//         status: "paid",  // Säkerställ att detta värde är korrekt satt
//         totalPrice: totalCost  // Anta att totalCost är korrekt beräknad tidigare
//     };

//     try {
//         const response = await fetch("http://localhost:3000/create-order", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(cartForMongo),
//         });

//         const data = await response.json();

//         if (response.ok) {
//             console.log("Order created successfully", data);
//             localStorage.setItem("sessionId", JSON.stringify(data.sessionId));
//             clearCart();
//             window.location.href = "/Confirmation";
//         } else {
//             console.error("Failed to create order", data);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// };






// return (
//   <div className={isOpen ? "fixed top-0 right-0  w-96 h-screen bg-emerald-100  p-5 shadow-lg overflow-y-auto z-50" : "hidden"}>
//     <div className="mt-6">
//     <ul>

//       {cart.map((item) => (
//         <li key={item.product._id} className="flex items-center justify-between mb-4">
//           <img
//             src={item.product.image}
//             alt={item.product.name}
//             className="w-20 h-20 mr-4"
//           />
//           <span>{item.product.name} - Amount: {item.quantity}</span>
//           <button
//             onClick={() => removeFromCart(item.product._id)}
//             className="bg-red-500 hover:bg-red-700 text-white rounded-full p-2 transition duration-150 ease-in-out">
//             <BsTrash3Fill />
//           </button>
//         </li>
//       ))}
//     </ul>
//     <div>Total Items: {totalQuantity}</div>
//     <div className="text-lg font-semibold">Total Cost: {totalCost} SEK</div>
//     <div className="flex justify-center mt-4">
//       <button onClick={handlePayment} className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded shadow cursor-pointer transition duration-150 ease-in-out">
//         PAY NOW
//       </button>
//     </div>
//     <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150 ease-in-out mt-20">
//       Close
//     </button>
//     </div>
//   </div>
// );
// };

// export default CartModal;
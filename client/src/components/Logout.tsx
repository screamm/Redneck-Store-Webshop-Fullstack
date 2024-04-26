import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useCart();

  const handleLogout = async () => {

      
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.status === 200) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        setUser({ email: "" });

        navigate("/");

        console.log("user logged out");
      }

      
     catch (error) {
      console.error("Logout error:", error);
    
    }
  };


  

  return (
    <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out mt-4">
      Log out
    </button>
  );
};

export default Logout;


    // const confirmLogout = confirm("LOGGING OUT?");
    // if (!confirmLogout) {
    //   return;
    // }

    // try {
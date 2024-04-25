import { useState, useEffect } from "react";
import { Registration } from "../components/Registration";
import { Login } from "../components/Login";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo redneck.png";


export const Admin = () => {
  const [user, setUser] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  const goToShopping = () => {
    navigate("/");
  };

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
      } catch (error: any) {
        console.error("Authorization-error:", error.message);
        setUser("");
      }
    };
    authorize();
  }, []);


return (
  <div className="flex flex-col items-center justify-center  bg-redneckbg h-screen">
    <h1 className="text-2xl font-bold text-center mb-4 ">
      {user ? (
        `INLOGGAD ${user}` 
      ) : (
        <img src={logo} alt="Logo" className="w-2/3 mx-auto pb-14" /> 
      )}
    </h1>
    {!user && (
      <>
        {isRegistering ? (
          <>
            <Registration />
            <span
              className=" text-white transition duration-200 mt-4 underline" 
              onClick={() => setIsRegistering(false)}>
              Back to Login
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <Login />
            <p className="text-sm text-gray-600 mt-2 mr-20">
              New User? Proceeed to registration{" "}
              <span
                className="text-blue-500 cursor-pointer hover:text-blue-700 transition duration-200"
                onClick={() => setIsRegistering(true)}>
                here
              </span>
              !
            </p>
            </div>
        )}
      </>
    )}
    {user && (
      <button
        onClick={goToShopping}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out mt-4"> 
        Go to Products
      </button>
    
    )}

  </div>
);
};

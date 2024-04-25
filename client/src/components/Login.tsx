import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useCart();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(
          `Login failed: ${response.status} ${response.statusText}`
        );
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);

      setUser({ email });
      console.log("user logged in: " + email);
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login. Please try again");
    }
  };
  return (
    <div className="flex flex-col items-center">
    <form onSubmit={handleSubmit} className="w-screen flex flex-col items-center px-4">
      <div className=" w-full max-w-md ">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="w-4/5 p-2.5 mt-1 rounded border border-gray-300 bg-[#dce8e1] focus:outline-none"
          
        />
      </div>
      <div className=" w-full max-w-md ">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="w-4/5 p-2.5 mt-1 rounded border border-gray-300 bg-[#dce8e1] focus:outline-none"
        />
      </div>
      {error && <div>{error}</div>}
      <div className=" w-full max-w-md flex justify-center mr-20" >
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out mt-4 ">Login</button>
      </div>
    </form>
    </div>
  );
};

import { useState } from "react";


export const Registration = () => {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setSuccessMessage("REGISTRATION OK - Please Login");
      setErrorMessage("");
    } catch (error: any) {
      console.error("Error registration:", error);
      setErrorMessage(error.message || "ERROR");
      setSuccessMessage("");
    }
  };


  return (
    

  <div className="flex flex-col items-center p-4">
    <h2 className="text-2xl font-bold mb-4">Register</h2>
    {errorMessage && <p className="text-red-500 font-bold">{errorMessage}</p>}
    {successMessage && <p className="text- font-bold">{successMessage}</p>}

    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
      className="w-4/5 p-2.5 mt-1 rounded border border-gray-300 bg-[#dce8e1] focus:outline-none"
    />
    
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
      className="w-4/5 p-2.5 mt-1 rounded border border-gray-300 bg-[#dce8e1] focus:outline-none"
    />

    <button onClick={handleRegister} className="ml-20 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out mt-4 mr-20">
      Register
    </button>
  </div>
);
}
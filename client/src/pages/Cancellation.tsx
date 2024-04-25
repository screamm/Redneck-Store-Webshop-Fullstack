import { useNavigate } from "react-router-dom";
import cancel from "../img/cancel.png";

export const Cancellation = () => {
  const navigate = useNavigate();

  setTimeout(function(){ window.location.href = "/store"; }, 5000);

  return (
    <div className="text-center p-5 bg-redneckbg  h-screen ">
      <button
        onClick={() => navigate("/store")}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-8 mb-5"
      >
        Back to store
      </button>
      <h3>This page will selfredirect in 5 seconds.....</h3>
      <img
        src={cancel}
        alt="Order cancelled"
        className="rounded-xl max-w-4xl p-10 mt-10"
      />
    </div>
  );
};

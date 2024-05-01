import { useNavigate } from "react-router-dom";
import thankyou from "../img/thankyou.png";


export const Confirmation = () => {

  const navigate = useNavigate();


  const goBackToShop = () => {
    navigate("/");
  };

  setTimeout(function(){ window.location.href = "/"; }, 10000);


return (
  <div className="text-center p-5 bg-redneckbg ">
    <button onClick={goBackToShop} className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-8 mb-5">
      To Store
    </button>
      <div className=" h-screen">
        <h3>This page will self-redirect back to store in 10 seconds..........</h3>
        <img
          src={thankyou}
          alt="Thank you "
          className="rounded-xl max-w-4xl p-10 mt-10"
        />
      </div>

  </div>
);

}
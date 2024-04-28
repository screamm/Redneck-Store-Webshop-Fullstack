import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import CartModal from "../components/CartModal";
import logo from "../img/logo redneck.png";
// import CircularProgress from '@mui/material/CircularProgress';

export const Store = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Fetching products...");
      try {
        const response = await fetch("http://localhost:3000/products");
        console.log("Server response ", response.status);
        if (!response.ok) {
          
          throw new Error("ERROR: Failed to fetch products");
        }
        // console.log("Server response ", response.status);

        const data = await response.json();
        // console.log("Fetched products:", data);
        setProducts(data || []);
        console.log("Fetched products:", data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
    
  }, []);
  // console.log("Fetched products:", products);

  // if (!products.length) {
  //   return (
  //   <div className="flex mt-96 justify-center">
      
  //   <CircularProgress />
  //   </div>
  // )}


return (
  <>
    <Header setIsModalOpen={setIsModalOpen} />
    <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />


    <div className="flex justify-center mt-6">
      <img src={logo} alt="Logo" className="w-1/3" />
    </div>


    <div className="mt-10 px-4 max-w-7xl mx-auto pb-60">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product: { _id: string; image: string; name: string; price: number }) => (
          <div key={product._id} className=" rounded-lg p-4 flex flex-col items-center">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full rounded-lg"
              />
            )}
            <h2 className="mt-2 font-bold text-black ">{product.name}</h2>
            <h3>{product.price}:-</h3>
            <button onClick={() => addToCart(product)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  </>
);
}


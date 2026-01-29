import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Heart from "./pics/heart.png";
import Heart1 from "./pics/heart1.png";

export default function Products() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");
  const { id } = useParams();
  const [stock, setStock] = useState("");
  const [fav, setFav] = useState(false);
  const [img, setImg] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState({});
  const [car, setCar] = useState("");
  const [fade, setFade] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => setData(res.data))
      .catch((e) => {
        console.log("item cannot be found", e);
        navigate("/home");
      });
  }, [id, navigate]);

  useEffect(() => {
    if (data) {
      if (data.image) {
        setCar(data.image);
      } else if (data.colors?.length > 0) {
        const firstColorKey = `image${data.colors[0].toLowerCase()}`;
        setCar(data[firstColorKey]);
      }
    }
  }, [data]);

  useEffect(() => {
    const checkFav = async () => {
      const cor = await axios.get(`http://localhost:5000/users/${userId}`);
      const check = cor.data.wishlist || [];
      const favlist = check.some((item) => item.id === data.id);
      setFav(favlist);
      setImg(favlist ? Heart1 : Heart);
    };
    checkFav();
  }, [id, userId, data.id]);

  const carimage = (color) => {
    const key = `image${color.toLowerCase()}`;
    if (!data[key]) return;

    setFade(false);

    setTimeout(() => {
      setCar(data[key]);
      setFade(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white pt-24 pb-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white/10 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-10">
       
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-[-7vh] left-[-10vw] text-gray-400 hover:text-red-500 text-2xl transition"
            title="Go Back"
          >
            ❌
          </button>
          <div className="relative w-full flex justify-center items-center">
            <img
              src={car}
              alt={data.name}
              className={`rounded-xl max-h-[400px] object-contain shadow-lg border-4 border-white/20 transition-opacity duration-500 ease-in-out bg-[#232136] ${fade ? "opacity-100" : "opacity-30"}`}
            />
            <button
              className="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
              onClick={() => {/* handle favorite toggle here if needed */}}
              title={fav ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              
            </button>
          </div>
          
          <div className="flex gap-5 mt-6">
            {data.colors?.map((c, i) => (
              <button
                key={i}
                onClick={() => carimage(c)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md hover:scale-110 transition-all duration-200 hover:border-white hover:shadow-[0_0_12px_rgba(109,40,217,0.4)] outline-none"
                style={{ background: c }}
                aria-label={`Select color ${c}`}
              ></button>
            ))}
          </div>
        </div>
       
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2 text-white/90 tracking-tight">{data.name}</h1>
          <p className="text-lg text-gray-300 mb-4">{data.description}</p>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-semibold text-purple-300">
              ${data.price}
            </span>
            {stock && (
              <span className="text-sm px-3 py-1 rounded-full bg-green-700/80 text-white">
                In Stock: {stock}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mb-8">
            <label htmlFor="quantity" className="text-gray-400">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg transition-all duration-200"
            onClick={() => {/* handle add to cart here */}}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

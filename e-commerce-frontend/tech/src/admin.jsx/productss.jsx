import { useEffect, useState } from "react";
import axios from "axios";
import "./productss.css";
import Plus from "../pics/plus.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const userId = localStorage.getItem("username");
  localStorage.setItem("userid", userId);

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [brand, setBrand] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    image: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    quantity: 1,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);

        const uniqueBrands = [...new Set(res.data.map((item) => item.brand))];
        setBrand(uniqueBrands);
      })
      .catch((err) => console.log("failed to fetch products", err));
  }, []);

  const handleEdit = (id) => {
    navigate(`/adminpanel/edit/${id}`);
  };

  const handleRemove = async (id) => {
    try {
      const productToUpdate = data.find((item) => item.id === id);
      if (!productToUpdate) return;

      const newActivity =
        productToUpdate.activity === "active" ? "inactive" : "active";

      await axios.patch(`http://localhost:5000/products/${id}`, {
        activity: newActivity,
      });

      const update = data.map((item) =>
        item.id === id ? { ...item, activity: newActivity } : item
      );

      setData(update);
      setFilteredData(update); 
    } catch (error) {
      console.log("Error removing product:", error);
    }
  };

  const handleNew = async () => {
    const res = await axios.post(`http://localhost:5000/products`, product);
    const ids = res.data.id;
    navigate(`/adminpanel/edit/${ids}`);
  };

  const handleSort = (brandName) => {
    if (brandName === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.brand === brandName);
      setFilteredData(filtered);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div onClick={() => handleSort("All")} className="brand_div">
          All
        </div>

        {brand.map((brand, index) => (
          <div
            onClick={() => handleSort(brand)}
            key={index}
            className="brand_div"
          >
            {brand}
          </div>
        ))}
      </nav>

      <div className="products_div1">
        <div className="product_list1">
          <div className="product_grid2" onClick={handleNew}>
            <img className="plus" src={Plus} alt="Add new" />
            <h1>Add new</h1>
          </div>

          {filteredData.filter((item)=>item.name!== "").map((t) => (
            <div className="product_grid1" key={t.id}>
              <div style={{ width: "88%" }} className="img_products1">
                <img
                  style={{ borderRadius: "10px" }}
                  src={t.image}
                  alt={t.name}
                  width="100%"
                />
              </div>
              <div style={{ padding: "1vw" }}>
                <h4>{t.name}</h4>
              </div>
              <div style={{ padding: "1vw", width: "100%" }}>
                <h6>{t.description}</h6>
              </div>
              <div className="btn_product1">
                <div>
                  <h6>₹{t.price}</h6>
                </div>
                <div>
                  <h6>category : {t.category}</h6>
                </div>
                <div>
                  <h6>Activity : {t.activity}</h6>
                </div>
              </div>

              <div className="btn_div1">
                <button
                  className="cart_button1"
                  onClick={() => handleEdit(t.id)}
                >
                  Edit
                </button>
                <button
                  className="cart_button11"
                  onClick={() => handleRemove(t.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

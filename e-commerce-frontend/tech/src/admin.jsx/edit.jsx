import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./edit.css";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    id: "",
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
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => setData(res.data))
      .catch((e) => console.log("Item cannot be found", e));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/products`);
      const products = res.data;

      
      const otherProducts = products.filter((p) => p.id !== id);

     
      const isDuplicate = otherProducts.some(
        (p) =>
          p.id === data.id ||
          p.name.trim().toLowerCase() === data.name.trim().toLowerCase()
      );

      if (isDuplicate) {
        alert("Product with same ID or Name already exists!");
        return;
      }

      await axios.patch(`http://localhost:5000/products/${id}`, data);
      alert("Product updated successfully!");
      navigate("/adminpanel/products");
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };
    

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>ID:</label>
          <input
            className="input_1"
            onChange={(e) => setData({ ...data, id: e.target.value })}
            value={data.id}
            placeholder="ID"
          />

          <label>NAME:</label>
          <input
            className="input_1"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="NAME"
          />

          <label>IMAGE REFERENCE:</label>
          <input
            className="input_1"
            value={data.image}
            onChange={(e) => setData({ ...data, image: e.target.value })}
            placeholder="IMAGE"
          />

          <label>BRAND:</label>
          <input
            className="input_1"
            value={data.brand}
            onChange={(e) => setData({ ...data, brand: e.target.value })}
            placeholder="BRAND"
          />

          <label>CATEGORY:</label>
          <input
            className="input_1"
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            placeholder="CATEGORY"
          />

          <label>PRICE:</label>
          <input
            className="input_1"
            type="number"
            value={data.price}
            onChange={(e) =>
              setData({ ...data, price: Number(e.target.value) })
            }
            placeholder="PRICE"
          />

          <label>DESCRIPTION:</label>
          <textarea
            className="textarea_1"
            onChange={(e) => setData({ ...data, description: e.target.value })}
            value={data.description}
            placeholder="DESCRIPTION"
          />

          <label>QUANTITY:</label>
          <input
            className="input_1"
            type="number"
            onChange={(e) =>
              setData({ ...data, quantity: Number(e.target.value) })
            }
            value={data.quantity}
            placeholder="QUANTITY"
          />

          <button className="btn" type="submit">
            SAVE
          </button>
        </form>
      </div>

      
      <div style={{ marginTop: "12vh" }}>
        <p className="goHome" onClick={() => navigate(-1)}>
          ❌
        </p>

        <div className="stock_div">
          <div className="inner_div">
            <div>Id: {data.id}</div>
            <img className="img" src={data.image} alt={data.name} />
            <div style={{ textAlign: "center", fontSize: "2vw" }}>
              Name: {data.name}
            </div>
            <div>Brand: {data.brand}</div>
            <div>Category: {data.category}</div>
            <div>Description: {data.description}</div>
            <div>Price: ₹{data.price}</div>
            <div>Available Quantity: {data.quantity}</div>
          </div>
        </div>
      </div>
    </>
  );
}

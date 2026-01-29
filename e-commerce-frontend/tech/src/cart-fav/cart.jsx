import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import "./cart.css";
import { NavLink, useNavigate } from "react-router-dom";
import Payment from "./payment";
import { setLocale } from "yup";



export default function Cart() {
  const [data, setData] = useState({});
  const [price, setPrice] = useState(0);
  const [quan, setQuan] = useState(0);
  const [cartLength, setCartLength ]=useState(0)
  const userId = localStorage.getItem("username");

localStorage.setItem("cartlength",quan)

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      if (!userId || userId === "undefined" || userId === "null") {
        navigate("/");
        return;
      }

      try {
        const datas = await axios.get(`http://localhost:5000/users/${userId}`);
        const userdata = datas.data;
        setData(userdata);

        if (userdata.cart && userdata.cart.length > 0) {
          const tot = userdata.cart.reduce(
            (acc, item) => acc + item.price * item.items,
            0
          );
  

          setPrice(tot);
          const qua = userdata.cart.reduce((acc, item) => acc + item.items, 0);
          setQuan(qua);
        } else {
          setPrice(0);
          setQuan(0);

        }
      } catch (err) {
        console.log("error", err);
      }
    };

    fetch();

  }, [userId]);

  const handleAdd = async (ids) => {
    if (!data.cart) return;

    const add = data.cart.map((item) => {
      if (ids === item.id && item.items < item.quantity) {
        return { ...item, items: item.items + 1 };
      } else {
        return item;
      }
    });

    axios
      .patch(`http://localhost:5000/users/${userId}`, { cart: add })
      .then(() => {
        setData((pre) => ({ ...pre, cart: add }));
        const tot = add.reduce((acc, item) => acc + item.price * item.items, 0);
        setPrice(tot);
        const qua = add.reduce((acc, item) => acc + item.items, 0);
        setQuan(qua);
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const handleMinus = (ids) => {
    if (!data.cart) return;

    const minus = data.cart.map((item) => {
      if (ids === item.id && item.items > 0) {
        return { ...item, items: item.items - 1 };
      } else {
        return item;
      }
    });

    axios
      .patch(`http://localhost:5000/users/${userId}`, { cart: minus })
      .then(() => {
        setData((pre) => ({ ...pre, cart: minus }));
        const tot = minus.reduce(
          (acc, item) => acc + item.price * item.items,
          0
        );
        setPrice(tot);

        const qua = minus.reduce((acc, item) => acc + item.items, 0);
        setQuan(qua);
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const handlePage = (ids) => {
    navigate(`/products/${ids}`);
  };
  const handleRemove = async (ids) => {
    if (!data.cart) return;

    const carts = data.cart.filter((ele) => ele.id !== ids);

    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        cart: carts,
      });
      setData((pre) => ({ ...pre, cart: carts }));
      const tot = carts.reduce((acc, item) => acc + item.price * item.items);
      setPrice(tot);

      const qua = carts.reduce((acc, item) => acc + item.items, 0);
      setQuan(qua);
    } catch (err) {
      console.log("error", err);
    }
  };

  const d = (price * 10) / 100;
  const dc = price - d;

  const handleOrder = async () => {
  const cartItems = data.cart || [];
  

    if (cartItems.length > 0) {
    
     
      navigate("/payment");
    } else {
      navigate("/");
    }
  };

  return (
    <>
 
      
      <div className="top_div">
        {data?.cart && data?.cart.length > 0 ? (
          data.cart.map((item) => (
            <div className="main_div" key={item.id}>
              <div className="image_div">
                <img
                  onClick={() => {
                    handlePage(item.id);
                  }}
                  src={item.image}
                />
              </div>
              <div className="name_div">
                <h2
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handlePage(item.id);
                  }}
                >
                  {item.name}
                </h2>
              </div>
              <div className="price_div">
                <h2>₹{item.price}</h2>
              </div>
              <div className="quantity_div">
                <div onClick={() => handleMinus(item.id)} className="minus">
                  -
                </div>
                <span className="quantity">{item.items}</span>
                <div className="add" onClick={() => handleAdd(item.id)}>
                  +
                </div>
              </div>
              <div className="remove_div">
                <span
                  onClick={() => {
                    handleRemove(item.id);
                  }}
                  className="remove"
                >
                  Remove
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ backgroundColor: "white" }}>
            {" "}
            <h1>no items found</h1>
            <p>
              add some items to cart{" "}
              <NavLink to="/" style={{ color: "black" }}>
                home
              </NavLink>
            </p>
          </div>
        )}
      </div>

      <div className="right_div">
        <div className="d1">
          <p>price : ({quan} items)</p>
        </div>
        <div className="d2">
          <p>₹{price}</p>
        </div>

        <div className="d1">
          <p>Discount 10%</p>
        </div>
        <div className="d2">
          <p style={{ color: "green" }}>- ₹{d}</p>
        </div>
        <div className="d1">
          <p>total price</p>
        </div>
        <div className="d2">
          <p>₹{dc}</p>
        </div>
        <div className="d3">
          <button className="bd" onClick={handleOrder}>
            place order
          </button>
        </div>
        <div className="underline"></div>
        <div className="d4">
          <p>you will save on ₹{d} this order</p>
        </div>
      </div>
      <div className="scroll"></div>


    </>
  );
}

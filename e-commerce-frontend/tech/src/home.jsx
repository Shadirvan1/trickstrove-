import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceSort, setPriceSort] = useState("");

  const navigate = useNavigate();

  const fetchProducts = async (params = {}) => {
    try {
      const res = await api.get("home/products/", { params });
      setProducts(res.data);

      const uniqueCategories = [
        ...new Set(res.data.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);

      if (selectedCategory) {
        const filteredBrands = [
          ...new Set(
            res.data
              .filter((p) => p.category === selectedCategory)
              .map((p) => p.brand)
          ),
        ];
        setBrands(filteredBrands);
      } else {
        setBrands([...new Set(res.data.map((p) => p.brand))]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = {};

    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (priceSort) params.ordering = priceSort;

    fetchProducts(params);
  }, [selectedCategory, selectedBrand, priceSort]);

  const addToCart = async (productId) => {
    try {
      const res = await api.post("cart/add/", {
        product: productId,
        quantity: 1,
      });
      alert(`${res.data.product} added to cart!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className=" mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <div className="flex flex-wrap gap-4 mb-6">

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedBrand("");
          }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border p-2 rounded"
          disabled={!selectedCategory}
        >
          <option value="">All Brands</option>
          {brands.map((brand, i) => (
            <option key={i} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort by Price</option>
          <option value="price">Low → High</option>
          <option value="-price">High → Low</option>
        </select>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="h-[60vh] border rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-[18vw] h-[40vh] object-cover rounded-md mb-2 cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            />
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-500">{product.brand}</p>
            <p className="font-bold mt-1">${product.price}</p>
            <button
              onClick={() => addToCart(product.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

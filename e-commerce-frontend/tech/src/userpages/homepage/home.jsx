import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAppContext } from "../../appcontext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceSort, setPriceSort] = useState("");

  /* 🔍 SEARCH (ADDED) */
  const { searchQuery } = useAppContext();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const navigate = useNavigate();

  /* 🔍 SEARCH DEBOUNCE (ADDED) */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("home/products/", { params });
      setProducts(res.data);

      setCategories([...new Set(res.data.map((p) => p.category))]);

      if (selectedCategory) {
        setBrands([
          ...new Set(
            res.data
              .filter((p) => p.category === selectedCategory)
              .map((p) => p.brand)
          ),
        ]);
      } else {
        setBrands([...new Set(res.data.map((p) => p.brand))]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* INITIAL LOAD */
  useEffect(() => {
    fetchProducts();
  }, []);

  /* FILTERS + SEARCH */
  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (priceSort) params.ordering = priceSort;
    if (debouncedSearch) params.search = debouncedSearch;

    fetchProducts(params);
  }, [selectedCategory, selectedBrand, priceSort, debouncedSearch]);

  const addToCart = async (productId) => {
    try {
      const res = await api.post("cart/add/", {
        product: productId,
        quantity: 1,
      });
      alert(`${res.data.product} added to cart!`);
    } catch {
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        All Products 🛍️
      </h1>

      <div className="flex flex-wrap gap-4 mb-8 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedBrand("");
          }}
          className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
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
          disabled={!selectedCategory}
          className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
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
          className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Sort by Price</option>
          <option value="price">Low → High</option>
          <option value="-price">High → Low</option>
        </select>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <span className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
            >
              <div
                className="h-65 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="ml-[20%] w-[60%] h-[50%] object-cover hover:scale-105 transition"
                />
              </div>

              <div className="p-4 space-y-1">
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-gray-500 text-sm">{product.brand}</p>
                <p className="font-bold text-blue-600">${product.price}</p>

                <button
                  onClick={() => addToCart(product.id)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

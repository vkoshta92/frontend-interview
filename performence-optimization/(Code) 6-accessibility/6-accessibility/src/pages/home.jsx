import {useEffect, useState} from "react";
import ProductCard from "../components/product-card";
import ProductCardSkeleton from "../components/product-skeleton";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubscribe = async () => {
    try {
      // Simulated API endpoint with a delay
      const subscribeEndpoint = (email) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (email === "test@example.com") {
              reject(new Error("Email already subscribed"));
            } else {
              resolve({message: "Subscribed successfully"});
            }
          }, 3500); // Simulated delay of 3.5 seconds
        });
      };

      // Call the simulated API endpoint
      const response = await subscribeEndpoint(email);

      console.log(response.message);
      setSubscribed(true);
    } catch (error) {
      console.error("Error subscribing:", error.message);
      // Handle error
    }
  };

  return (
    <div className="container mx-auto mt-5 pt-2">
      <div className="relative mb-8">
        <img
          src="https://i.ibb.co/JjhypbR/rs-big.webp"
          alt="RoadsideCoder Banner"
          className="w-full h-72 object-left md:object-right object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 flex items-center px-9 md:justify-end md:px-32">
          <h1 className="text-4xl font-Kanit md:text-5xl font-bold text-white">
            RoadsideCoder Store
          </h1>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <ProductCardSkeleton count={10} />
        ) : (
          products
            .slice(0, 10)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
        )}
      </div>
      <a
        href="/products"
        className="block text-center mt-8 bg-blue-900 p-3 rounded-md text-white font-bold hover:underline"
      >
        See All Products
      </a>

      <div className="mt-8 mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Subscribe to Our Newsletter
        </h3>
        <div className="flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none"
          />
          <button
            onClick={handleSubscribe}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:outline-none"
          >
            Subscribe
          </button>
        </div>
        {subscribed && (
          <p className="mt-2 text-green-500">Subscribed successfully!</p>
        )}
      </div>
    </div>
  );
};

export default Home;

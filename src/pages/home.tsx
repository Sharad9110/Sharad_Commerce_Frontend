import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/loader";
import ProductCard from "../components/productCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItemType } from "../types/types";

const Home = () => {

  const dispatch = useDispatch();

  const{ data, isLoading, isError } = useLatestProductsQuery("");

  //dispatching data to addToCart action
  const addToCartHandler = (cartItem: CartItemType) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if(isError) toast.error("Cant Fetch Latest Product");

  return (
    <div className="home">
      <section>

      </section>

      <h1> Latest Products
           <Link to = "/search" className="findmore"> More </Link>
      </h1>

      <main> 
        {isLoading? <Loader /> :  data?.products.map((i) => (
          <ProductCard key = {i._id}
          productId = {i._id}
          name = {i.name}
          price = {i.price}
          stock = {i.stock}
          photo = {i.photo}
          handler={addToCartHandler}
      />
        ))}
     </main>
    </div>
  )
}

export default Home
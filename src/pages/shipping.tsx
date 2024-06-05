import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { RootState, server } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import axios from "axios";


const Shipping = () => {

  const { cartItems, total } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [shippingInfo, setShippingInfo] = useState({
    address : "",
    city : "",
    state : "",
    country : "",
    pincode : ""
  })

  const changeHandler = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setShippingInfo((prev) => ({...prev, [e.target.name] : e.target.value}))
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };




  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems]);

  return (
    <div className="shipping">

      <button className="back-btn" onClick={() => navigate("/cart")}> <BiArrowBack /> </button>

      <form onSubmit={submitHandler}>
          <h1> Shipping Address </h1>

          <input type="text" placeholder="Address" name ="address" value = {shippingInfo.address} onChange={changeHandler} required/>
          <input type="text" placeholder="City" name ="city" value = {shippingInfo.city} onChange={changeHandler} required/>
          <input type="text" placeholder="State" name ="state" value = {shippingInfo.state} onChange={changeHandler} required/>
          <select name="country" id="" required value = {shippingInfo.country} onChange={changeHandler}>
              <option value=""> Choose Country </option>
              <option value="india"> India </option>
              <option value="india"> America </option>
              <option value="india"> US </option>
          </select>
          <input type="number" placeholder="PIN CODE" name ="pincode" value = {shippingInfo.pincode} onChange={changeHandler} required/>

          <button> Pay Now </button>
      </form>

      
    </div>
  )
}

export default Shipping
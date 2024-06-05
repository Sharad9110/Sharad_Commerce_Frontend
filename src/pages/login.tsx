import { signInWithPopup } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth"
import { useState } from "react"
import toast from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { auth } from "../firebase"
import { useLoginMutation } from "../redux/api/userAPI"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { MessageResponse } from "../types/api-types"



const Login = () => {

    const[gender, setgender] = useState("")
    const[date, setDate] = useState("")

    const [login] = useLoginMutation();

    const loginHandler = async () => {
        try{

            const provider = new GoogleAuthProvider();

            const {user} = await signInWithPopup(auth, provider);

            const res = await login({
                name: user.displayName!,
                email: user.email!,
                photo: user.photoURL!,
                gender,
                role: "user",
                dob: date,
                _id: user.uid,
              });

              if ("data" in res) {
                toast.success(res.data.message);
              } else {
                const error = res.error as FetchBaseQueryError;
                const message = (error.data as MessageResponse).message;
                toast.error(message);
              }

            console.log(user);
            

        }catch(err){
            toast.error("Sign In Fail");
            console.log(err);
            
        }
    }

  return (
    <div className="login">
        <main>
            <h1 className="heading"> Log In </h1>

            <div>
                <label> Gender </label>
                <select name="gender" id="" value={gender} onChange={(e) => setgender(e.target.value)}>
                    <option value=""> Choose Gender </option>
                    <option value="male"> Male </option>
                    <option value="female"> Female </option>
                </select>
            </div>
            <div>
                <label> DOB </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
            </div>

            <div>
                <p> Already Sign In Once </p>
                <button onClick={loginHandler}> 
                    <FcGoogle /> <span> Sign In With Google </span>
                </button>
            </div>



        </main>
    </div>
  )
}

export default Login
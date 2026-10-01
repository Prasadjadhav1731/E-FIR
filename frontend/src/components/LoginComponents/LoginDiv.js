import React, { useState } from "react";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../config/api";

const LoginDiv = ({ setCurrentUser, setLogin }) => {
  const [pVisible, setPVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    RememberMe: false,
  });
  const navigate = useNavigate();

  const LogInHandler = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!userDetails.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!userDetails.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      const response = await toast.promise(
        axios.post(`${API_BASE_URL}/login`, {
          email: userDetails.email,
          password: userDetails.password,
          RememberMe: userDetails.RememberMe,
        }),
        {
          loading: "Logging in...",
          success: (data) => {
            localStorage.setItem("token", data.data.data.token);
            setCurrentUser(data.data.data);
            navigate(`/`);
            return "Login successful";
          },
          error: (err) => {
            setCurrentUser("");
            return err.response?.data?.message || "Login failed";
          },
        }
      );

      if (response) navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    setUserDetails((state) => ({
      ...state,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 0, x: -100 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex justify-center z-10 items-center"
    >
      <form
        onSubmit={LogInHandler}
        className="flex flex-col bg-white bg-opacity-50 items-center shadow p-6 m-4 gap-4 py-4 rounded-xl min-w-[280px] w-[400px]"
      >
        <div className="w-fit text-xl text-black font-bold">Login</div>

        <div className="w-full text-black">
          <p className="mb-1 font-medium">Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            value={userDetails.email}
            name="email"
            onChange={changeHandler}
            required
            className="px-3 py-2 bg-gray-50 bg-opacity-80 rounded-lg shadow w-full text-black outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="w-full relative text-black">
          <p className="mb-1 font-medium">Password</p>
          <input
            placeholder="Enter your password"
            type={pVisible ? "text" : "password"}
            id="password"
            value={userDetails.password}
            name="password"
            onChange={changeHandler}
            required
            className="px-3 py-2 bg-gray-50 bg-opacity-80 rounded-lg shadow w-full text-black outline-none focus:ring-2 focus:ring-green-400 pr-10"
          />
          <button
            type="button"
            id="togglePassword"
            className="absolute cursor-pointer right-3 text-black top-9 focus:outline-none"
            onClick={() => setPVisible((state) => !state)}
          >
            {pVisible ? <MdVisibility /> : <MdVisibilityOff />}
          </button>
        </div>

        <div className="w-full text-black">
          <label
            htmlFor="RememberMe"
            className="cursor-pointer select-none text-sm flex items-center gap-2 pl-1"
          >
            <input
              type="checkbox"
              id="RememberMe"
              name="RememberMe"
              checked={userDetails.RememberMe}
              onChange={changeHandler}
              className="w-4 h-4 text-green-600 rounded"
            />
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          className="w-fit text-center cursor-pointer px-6 py-2 bg-green-500 shadow text-white font-medium rounded-xl transition-all duration-300 hover:bg-green-600 hover:scale-105 active:scale-95"
        >
          Login
        </button>

        <div className="text-black text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => setLogin((state) => !state)}
            className="text-orange-500 font-bold cursor-pointer hover:underline"
          >
            SignUp Here
          </span>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginDiv;

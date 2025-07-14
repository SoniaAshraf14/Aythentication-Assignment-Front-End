import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id); // ✅ Save userId here

      alert("Login Successful");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>

      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
        className="w-full border px-3 py-2 rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
        className="w-full border px-3 py-2 rounded"
      />
      {errors.password && <p className="text-red-500 text-sm">Password is required</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Login
      </button>

      <div className="text-center mt-2 space-y-1">
        <p
          className="text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => navigate("/forgotpassword")}
        >
          Forgot Password?
        </p>

        <p className="text-sm">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;

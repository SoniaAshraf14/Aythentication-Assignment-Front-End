import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PasswordCheck = ({ label, isValid }) => (
  <div className={`flex items-center gap-2 text-sm ${isValid ? "text-green-600" : "text-red-600"}`}>
    <span>{isValid ? "✅" : "❌"}</span>
    <span>{label}</span>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const [coverPreview, setCoverPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [canUpdateUsername, setCanUpdateUsername] = useState(false);
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("coverPhoto", data.coverPhoto[0]);
    formData.append("profileImage", data.profileImage[0]);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender);
    formData.append("dob", data.dob);

    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      setGeneratedUsername(res.data.username);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  const updateUsername = async () => {
    const newUsername = prompt("Enter new username:");
    if (!newUsername) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/user/update-username",
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setGeneratedUsername(newUsername);
    } catch (err) {
      alert(err.response?.data?.error || "Username update failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Create Your Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">

        {/* Cover Photo */}
        <div>
          <label className="block font-medium mb-1">Cover Photo</label>
          <input
            type="file"
            {...register("coverPhoto", { required: true })}
            onChange={(e) => setCoverPreview(URL.createObjectURL(e.target.files[0]))}
            className="block w-full border rounded px-3 py-2"
          />
          {coverPreview && <img src={coverPreview} alt="cover" className="mt-2 w-full h-32 object-cover rounded" />}
          {errors.coverPhoto && <p className="text-red-600 text-sm mt-1">Cover photo is required</p>}
        </div>

        {/* Profile Image */}
        <div>
          <label className="block font-medium mb-1">Profile Image</label>
          <input
            type="file"
            {...register("profileImage", { required: true })}
            onChange={(e) => setProfilePreview(URL.createObjectURL(e.target.files[0]))}
            className="block w-full border rounded px-3 py-2"
          />
          {profilePreview && <img src={profilePreview} alt="profile" className="mt-2 w-20 h-20 rounded-full object-cover" />}
          {errors.profileImage && <p className="text-red-600 text-sm mt-1">Profile image is required</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="text"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^03[0-9]{9}$/,
                message: "Enter a valid Pakistani number (e.g. 03XXXXXXXXX)",
              },
            })}
            className="block w-full border rounded px-3 py-2"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
            })}
            className="block w-full border rounded px-3 py-2"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              validate: {
                minLength: (v) => v.length >= 8 || "Minimum 8 characters",
                hasNumber: (v) => /\d/.test(v) || "Must include a number",
                hasUpper: (v) => /[A-Z]/.test(v) || "Must include an uppercase letter",
                hasSpecial: (v) => /[@$!%*?#&]/.test(v) || "Must include a special character",
              },
            })}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full border rounded px-3 py-2"
          />
          {errors.password && typeof errors.password.message === "string" && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}

          {/* Real-time Password Check */}
          <div className="mt-2 space-y-1">
            <PasswordCheck label="At least 8 characters" isValid={password.length >= 8} />
            <PasswordCheck label="At least one number" isValid={/\d/.test(password)} />
            <PasswordCheck label="At least one uppercase letter" isValid={/[A-Z]/.test(password)} />
            <PasswordCheck label="At least one special character (@$!%*?#&)" isValid={/[@$!%*?#&]/.test(password)} />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            {...register("gender", { required: "Gender is required" })}
            className="block w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="custom">Custom</option>
          </select>
          {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            {...register("dob", {
              required: "Date of Birth is required",
              validate: (value) => {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const isOldEnough = age > 15 || (age === 15 &&
                  (today.getMonth() > birthDate.getMonth() ||
                    (today.getMonth() === birthDate.getMonth() &&
                      today.getDate() >= birthDate.getDate())));
                return isOldEnough || "You must be at least 15 years old";
              },
            })}
            className="block w-full border rounded px-3 py-2"
          />
          {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob.message}</p>}
        </div>

        {/* Username Display */}
        {generatedUsername && (
          <div>
            <label className="block font-medium mb-1">Your Username</label>
            <input
              type="text"
              value={generatedUsername}
              readOnly
              className="block w-full border rounded px-3 py-2 bg-gray-100"
            />
            {canUpdateUsername && (
              <button
                type="button"
                onClick={updateUsername}
                className="mt-2 text-blue-600 underline text-sm"
              >
                Update Username
              </button>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;

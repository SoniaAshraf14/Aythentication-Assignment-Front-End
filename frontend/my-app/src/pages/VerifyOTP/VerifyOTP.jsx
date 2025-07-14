import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      alert("OTP verified.");
      navigate("/resetpassword", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setMessage("OTP has been resent.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center text-red-600 mt-10">
        ❌ Something went wrong. Please go back and enter your email again.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Enter OTP</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center bg-red-50 py-2 px-3 rounded-md">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 text-sm text-green-600 text-center bg-green-50 py-2 px-3 rounded-md">
            {message}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
          <input
            type="text"
            placeholder="Enter the OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive OTP?{" "}
            <button
              onClick={handleResendOtp}
              disabled={resending}
              className="text-blue-600 font-medium hover:underline"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

import { Routes, Route } from 'react-router-dom';
import Signup from '../pages/SignUp';
import Login from '../pages/Login/Login';
import ForgotPassword from '../pages/ForgetPassword/ForgetPassword';
import VerifyOtp from '../pages/VerifyOTP/VerifyOTP';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import Dashboard from '../pages/Dashboard/Dashboard';

export function Router() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setMessage("You are not authorized to view this page.");
      }
    };

    fetchUsers();
  }, [token]);

  const toggleStatus = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/admin/users/${userId}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User status updated.");

      const res = await axios.get("http://localhost:5000/api/users/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setMessage("Error updating status.");
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Admin Dashboard</h2>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {message && <p className="text-center text-blue-600 mb-4">{message}</p>}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="flex justify-between items-center p-4 border rounded">
            <div>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Status:</strong> {user.status}</p>
            </div>
            <button
              onClick={() => toggleStatus(user._id)}
              className={`px-4 py-2 rounded text-white ${user.status === "active" ? "bg-red-600" : "bg-green-600"}`}
            >
              {user.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
      >
        Back to User Dashboard
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center space-y-4">
            <p className="text-xl font-semibold">Are you sure you want to logout?</p>
            <div className="space-x-4">
              <button
                onClick={confirmLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

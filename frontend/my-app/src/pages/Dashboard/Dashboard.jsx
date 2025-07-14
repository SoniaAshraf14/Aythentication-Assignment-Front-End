import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [updateMsg, setUpdateMsg] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
        setUsername(res.data.username);
      } catch (err) {
        setUpdateMsg("User not logged in or error fetching user.");
      }
    };

    fetchUser();
  }, [token, userId]);

  const handleImageUpload = async () => {
    const formData = new FormData();
    if (coverFile) formData.append("coverPhoto", coverFile);
    if (profileFile) formData.append("profileImage", profileFile);

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/users/update-photo/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data.user);
      setUpdateMsg("Images updated successfully.");
    } catch (err) {
      setUpdateMsg("Error uploading images.");
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/users/update-username/${user._id}`,
        { newUsername: username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser((prev) => ({ ...prev, username }));
      setUpdateMsg("Username updated successfully.");
      setEditingUsername(false);
    } catch (err) {
      setUpdateMsg(err.response?.data?.error || "Username update failed.");
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (!user) return <div className="text-center mt-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-800">User Dashboard</h2>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Cover Image */}
      <div className="relative">
        <img
          src={`http://localhost:5000/uploads/${user.coverPhoto}`}
          alt="Cover"
          className="w-full h-48 object-cover rounded-xl"
        />
        <input
          type="file"
          onChange={(e) => setCoverFile(e.target.files[0])}
          className="mt-2"
        />
      </div>

      {/* Profile Image */}
      <div className="flex justify-center items-center flex-col">
        <img
          src={`http://localhost:5000/uploads/${user.profileImage}`}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <input
          type="file"
          onChange={(e) => setProfileFile(e.target.files[0])}
          className="mt-2"
        />
      </div>

      {/* User Info */}
      <div className="text-center">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>
        <p><strong>Password:</strong> 🔒 Hidden</p>

        <div className="mt-4">
          <strong>Username:</strong>
          {editingUsername ? (
            <div className="mt-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <button
                className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
                onClick={handleUsernameUpdate}
              >
                Save
              </button>
              <button
                className="ml-2 bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setEditingUsername(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <span className="ml-2">
              {user.username}
              <button
                className="ml-2 text-blue-600 underline text-sm"
                onClick={() => setEditingUsername(true)}
              >
                Edit
              </button>
            </span>
          )}
        </div>

        <button
          onClick={handleImageUpload}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Update Images
        </button>

        {updateMsg && (
          <p className="mt-2 text-center text-sm text-blue-600">{updateMsg}</p>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
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

export default Dashboard;

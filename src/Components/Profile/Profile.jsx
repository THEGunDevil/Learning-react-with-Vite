import React, { useContext, useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaPlusCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { UserContext } from "../../Contexts/UserContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser, signout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const fetchData = async () => {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        const userData = docSnap.data();
        setUser(userData);
        setFormData({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          phone: userData.phone || "",
          address: userData.address || "",
        });
      };
      fetchData();
    }
  }, [user?.uid, setUser]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    if (!formData.firstname || !formData.lastname) {
      alert("First name and last name are required");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signout();
  };

  const handleCancelEdit = () => {
    setFormData({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setIsEditing(false);
  };

  return (
    <>
      {user ? (
        <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <section className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-indigo-700 px-6 py-8 text-white">
                <div className="lg:flex block items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center">
                      <FaUser className="text-3xl" />
                    </div>
                    <div>
                      {isEditing ? (
                        <div className=" sm:flex-row flex flex-col gap-2">
                          <input
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            className="w-9/12 p-2 border rounded text-white"
                            placeholder="First Name"
                          />
                          <input
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="w-9/12 p-2 border rounded text-white"
                            placeholder="Last Name"
                          />
                        </div>
                      ) : (
                        <h1 className="text-2xl font-bold">
                          {user?.firstname} {user?.lastname}
                        </h1>
                      )}
                      <p className="text-indigo-200">
                        Member since{" "}
                        {user?.createdAt?.toDate().toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-5 lg:p-0">
                    {user?.roles === "Author" && (
                      <button
                        onClick={() => navigate("/addproduct")}
                        className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors"
                      >
                        <FaPlusCircle className="text-sm" />
                        <span>Add Product</span>
                      </button>
                    )}

                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveChanges}
                          disabled={loading}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-800 px-4 py-2 rounded-md transition-colors"
                        >
                          <FaSave className="text-sm" />
                          <span>{loading ? "Saving..." : "Save"}</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
                        >
                          <FaTimes className="text-sm" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors"
                      >
                        <FaEdit className="text-sm" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Personal Information
                    </h2>

                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Phone</p>
                        {isEditing ? (
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="Phone number"
                          />
                        ) : (
                          <p className="font-medium">
                            {user?.phone || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Address</p>
                        {isEditing ? (
                          <input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="Address"
                          />
                        ) : (
                          <p className="font-medium">
                            {user?.address || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isEditing && (
                      <div className="flex items-center space-x-3">
                        <FaSignOutAlt className="text-gray-500" />
                        <button
                          onClick={handleSignOut}
                          className="bg-indigo-600 px-4 py-2 text-white rounded-[10px] cursor-pointer hover:bg-indigo-700 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Account Settings
                    </h2>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-gray-700 mb-2">
                        Password
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Last changed 3 months ago
                      </p>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Change Password
                      </button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-gray-700 mb-2">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Receive updates and notifications
                      </p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="notifications"
                          defaultChecked
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="notifications" className="text-sm">
                          Email notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6">
                  <h2 className="text-lg font-semibold text-red-600 mb-4">
                    Danger Zone
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-50 rounded-md">
                    <div>
                      <h3 className="font-medium text-red-700">
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-500">
                        Once deleted, all your data will be permanently lost.
                      </p>
                    </div>
                    <button className="mt-3 cursor-pointer sm:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      ) : (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-200 mb-4">
              <FaUser className="text-3xl text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              You are not signed in
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in or register to view your profile
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Link
                to="/signin"
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FaSignInAlt className="mr-2" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              >
                <FaUserPlus className="mr-2" />
                Register
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Profile;

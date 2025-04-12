import React, { Suspense, useContext, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { UserContext } from "../Contexts/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, setUser, signout } = useContext(UserContext);

  useEffect(() => {
    if (user?.uid) {
      const fetchData = async () => {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        setUser(docSnap.data());
      };
      fetchData();
    }
  }, [user?.uid, setUser]);

  const handleSignOut = () => {
    signout();
  };

  return (
    <> 
      {user ? (
        <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Profile Header */}
              <div className="bg-indigo-700 px-6 py-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center">
                      <FaUser className="text-3xl" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">
                        {user?.firstname} {user?.lastname}
                      </h1>
                      <p className="text-indigo-200">
                        Member since{" "}
                        {user?.createdAt?.toDate().toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors">
                    <FaEdit className="text-sm" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Profile Details */}
              <div className="px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Personal Information
                    </h2>
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">
                          {user?.firstname} {user?.lastname}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {user?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {user?.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaSignOutAlt className="text-gray-500" />
                      <button
                        onClick={handleSignOut}
                        className="bg-indigo-600 px-4 py-2 text-white rounded-[10px] cursor-pointer hover:bg-indigo-700 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>

                  {/* Account Settings */}
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

                {/* Danger Zone */}
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
            </div>
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

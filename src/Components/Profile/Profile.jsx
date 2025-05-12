import { useContext, useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import MyProducts from "../MyProducts/MyProducts";
import { db } from "../../Firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { handleShowPassWord } from "../..";
const ConfirmDeletePopup = ({ onConfirm, onCancel }) => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = () => {
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    onConfirm(password);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="delete-account-title"
      aria-describedby="delete-account-desc"
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
      tabIndex={0}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3
          id="delete-account-title"
          className="text-lg font-semibold text-gray-800 mb-4"
        >
          Delete Account
        </h3>
        <p id="delete-account-desc" className="text-sm text-gray-600 mb-4">
          Are you sure you want to permanently delete your account? This action
          cannot be undone.
        </p>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 mb-1 flex items-center justify-between"
          >
            <span> Enter your password to confirm</span>
            <span onClick={()=>handleShowPassWord(showPassword,setShowPassword)}>{showPassword ? <BsFillEyeSlashFill/> : <BsFillEyeFill/>}</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Password"
          />
          {passwordError && (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, signout, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const auth = getAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Phone number regex (US formats: 123-456-7890, (123) 456-7890, 1234567890, etc.)
  const phoneRegex = /^\+?1?\s*(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;

  useEffect(() => {
    if (user) {
      // Initialize formData with user data from context
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate phone number in real-time
    if (name === "phone") {
      if (value && !phoneRegex.test(value)) {
        setPhoneError("Please enter a valid phone number (e.g., 123-456-7890)");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!formData.firstname || !formData.lastname) {
      toast.error("First name and last name are required", {
        position: "bottom-center",
      });
      return;
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setPhoneError("Please enter a valid phone number (e.g., 123-456-7890)");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, formData);
      // Update user context with new data
      setUser({ ...user, ...formData });
      toast.success("Profile updated successfully!", {
        position: "top-center",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("Failed to update profile", { position: "bottom-center" });
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
    setPhoneError("");
  };

  const handleDeleteAccount = async (password) => {
    setDeleteLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is signed in.");
      }

      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      // Delete Firebase Authentication account
      await deleteUser(currentUser);

      // Delete user data from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Clear user context and redirect
      navigate("/");
      toast.success("Your account has been successfully deleted.", {
        position: "top-center",
      });
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.", {
          position: "bottom-center",
        });
      } else if (error.code === "auth/requires-recent-login") {
        toast.error(
          "Your session has expired. Please sign out and sign back in to delete your account.",
          { position: "bottom-center" }
        );
        navigate("/signin");
      } else {
        toast.error("Failed to delete account", { position: "bottom-center" });
      }
    } finally {
      setDeleteLoading(false);
      setShowDeletePopup(false);
    }
  };

  return (
    <>
      {user ? (
        <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <section className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-indigo-700 px-4 py-6 text-white">
                <div className="lg:flex block items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="sm:h-20 sm:w-20 h-17 w-17 rounded-full bg-indigo-600 flex items-center justify-center">
                      <FaUser className="text-3xl" />
                    </div>
                    <div>
                      {isEditing ? (
                        <div className="sm:flex-row flex flex-col gap-2">
                          <input
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            className="w-9/12 p-2 border rounded text-white placeholder-white focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="First Name"
                          />
                          <input
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="w-9/12 p-2 border rounded text-white placeholder-white focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Last Name"
                          />
                        </div>
                      ) : (
                        <h1 className="text-xl font-bold">
                          {user?.firstname} {user?.lastname}
                        </h1>
                      )}
                      <p className="text-indigo-200 text-[13px] sm:text-lg mt-1">
                        Member since{" "}
                        {user?.createdAt &&
                        typeof user.createdAt.toDate === "function"
                          ? user.createdAt.toDate().toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-5 lg:p-0">
                    {user?.role === "Admin" && (
                      <button
                        onClick={() => navigate("/addproduct")}
                        className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-800 sm:px-4 px-2.5 py-2 rounded-md transition-colors"
                      >
                        <FaPlusCircle className="text-sm" />
                        <span className="sm:text-lg text-[13px]">
                          Add Product
                        </span>
                      </button>
                    )}
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveChanges}
                          disabled={loading}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-800 sm:px-4 px-2.5 py-2 rounded-md transition-colors"
                        >
                          <FaSave className="text-sm" />
                          <span className="sm:text-lg text-[13px]">
                            {loading ? "Saving..." : "Save"}
                          </span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-800 sm:px-4 px-2.5 py-2 rounded-md transition-colors"
                        >
                          <FaTimes className="text-sm" />
                          <span className="sm:text-lg text-[13px]">Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-800 sm:px-4 px-2.5 py-2 rounded-md transition-colors"
                      >
                        <FaEdit className="text-sm" />
                        <span className="sm:text-lg text-[13px]">
                          Edit Profile
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-8">
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
                          <div>
                            <input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full p-2 border rounded no-spin focus:ring-indigo-500 focus:border-indigo-500 ${
                                phoneError ? "border-red-500" : ""
                              }`}
                              placeholder="Phone number (e.g., 123-456-7890)"
                              type="text"
                              aria-describedby="phoneError"
                              aria-invalid={phoneError ? "true" : "false"}
                            />
                            {phoneError && (
                              <p
                                id="phoneError"
                                className="text-sm text-red-500 mt-1"
                                role="alert"
                              >
                                {phoneError}
                              </p>
                            )}
                          </div>
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
                            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                      <button
                        onClick={() => navigate("/changepassword")}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer"
                      >
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
                    <button
                      onClick={() => setShowDeletePopup(true)}
                      disabled={deleteLoading}
                      className="mt-3 cursor-pointer sm:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors disabled:bg-red-400"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* {user?.role === "Admin" && <MyProducts />} */}
          {showDeletePopup && (
            <ConfirmDeletePopup
              onConfirm={handleDeleteAccount}
              onCancel={() => setShowDeletePopup(false)}
            />
          )}
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

import React, { useContext, useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { UserContext } from "../../Contexts/UserContext";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { user } = useContext(UserContext);
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is signed in.");
      }

      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update the password
      await updatePassword(currentUser, formData.newPassword);
      toast.success("Password updated successfully!", { position: "top-center" });

      // Reset form
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswords({ currentPassword: false, newPassword: false, confirmPassword: false });
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        setErrors((prev) => ({ ...prev, currentPassword: "Incorrect current password" }));
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Session expired. Please sign in again to update your password.", {
          position: "bottom-center",
        });
        navigate("/signin");
      } else if (error.code === "auth/weak-password") {
        setErrors((prev) => ({ ...prev, newPassword: "Password is too weak" }));
      } else {
        toast.error(`Failed to update password: ${error.message}`, { position: "bottom-center" });
      }
    } finally {
        setLoading(false);
        navigate("/profile")
    }
  };

  const handleCancel = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setShowPasswords({ currentPassword: false, newPassword: false, confirmPassword: false });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md px-4 py-6 sm:py-6 sm:px-6 sm:my-10">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.currentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full p-2 pl-10 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter current password"
              aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
              disabled={loading}
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPasswords.currentPassword ? "Hide password" : "Show password"}
            >
              {showPasswords.currentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.currentPassword && (
            <p id="currentPassword-error" className="text-sm text-red-500 mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.newPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full p-2 pl-10 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter new password"
              aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
              disabled={loading}
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPasswords.newPassword ? "Hide password" : "Show password"}
            >
              {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.newPassword && (
            <p id="newPassword-error" className="text-sm text-red-500 mt-1">
              {errors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 pl-10 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm new password"
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              disabled={loading}
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPasswords.confirmPassword ? "Hide password" : "Show password"}
            >
              {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
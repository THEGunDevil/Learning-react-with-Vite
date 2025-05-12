import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../Contexts/UserContext";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { handleShowPassWord } from "../..";
const RegistrationPage = () => {
  const navigate = useNavigate();
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleShowConfirmPassWord = (e) => {
    setShowConfirmPassword((prev) => !prev);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Oops! The passwords you entered don't match.", {
          position: "bottom-center",
        });
        setLoading(false);
        return;
      }

      // Call the register function and wait for it to complete
      const registeredUser = await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone,
        formData.address
      );

      if (registeredUser) {
        // Reset form after successful registration
        e.target.reset();
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
        });

        // Navigate to profile page after user context is updated
        navigate("/profile");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("There was an error registering your account:", error);
      toast.error("There was an error registering your account.", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div className="flex py-10 justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-9.5 mx-auto">
        <div className="bg-white w-[320px] sm:w-full py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-y-8 sm:gap-8">
              <section className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 flex justify-between items-center"
                  >
                    <span>Password</span>
                    <span
                      className="cursor-pointer"
                      onClick={()=>handleShowPassWord(showPassword,setShowPassword)}
                    >
                      {showPassword ? (
                        <BsFillEyeSlashFill />
                      ) : (
                        <BsFillEyeFill />
                      )}
                    </span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 flex justify-between items-center"
                  >
                    <span>Confirm Password</span>
                    <span
                      className="cursor-pointer"
                      onClick={(e) => handleShowConfirmPassWord(e)}
                    >
                      {showConfirmPassword ? (
                        <BsFillEyeSlashFill />
                      ) : (
                        <BsFillEyeFill />
                      )}
                    </span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              <div className="h-px w-full bg-gray-300 sm:h-auto sm:w-px sm:mx-4 mx-0 my-4 sm:my-0" />

              <section className="space-y-6">
                <div className="bg-white text-gray-500 text-lg sm:hidden block">
                  Additional Information
                </div>
                <div className="hidden sm:block bg-white text-gray-500 text-lg">
                  Additional Information
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <NavLink
                to="/signin"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;

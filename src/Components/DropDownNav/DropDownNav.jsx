import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa6";
import { UserContext } from "../../Contexts/UserContext";
import { FaHome, FaSignInAlt, FaTachometerAlt, FaUser } from "react-icons/fa";

function DropDownNav() {
  const { user } = useContext(UserContext);
  return (
    <>
      <ul className="uppercase space-y-3 h-fit py-4 px-6 top-20 flex text-[19px] flex-col">
        <li className="flex hover:bg-gray-100 p-1.5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center ${isActive ? "text-amber-500" : ""}`
            }
          >
            <FaHome className="mr-1.5 text-amber-400 text-xl" />
            home
          </NavLink>
        </li>
        <li className="flex hover:bg-gray-100 p-1.5">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center ${isActive ? "text-amber-500" : ""}`
            }
          >
            <FaUser className="mr-1.5 text-amber-400 text-xl" />
            profile
          </NavLink>
        </li>
        {user ? (
          ""
        ) : (
          <li className="flex hover:bg-gray-100 p-1.5">
            <NavLink
              to="signin"
              className={({ isActive }) =>
                `flex items-center ${isActive ? "text-amber-500" : ""}`
              }
            >
              <FaSignInAlt className="mr-1.5 text-amber-400 text-xl" />
              Sign in
            </NavLink>
          </li>
        )}

        <li className="flex hover:bg-gray-100 p-1.5">
          <NavLink
            to="register"
            className={({ isActive }) =>
              `flex items-center ${isActive ? "text-amber-500" : ""}`
            }
          >
            <FaUserPlus className="mr-1.5 text-amber-400 text-xl" />
            Register
          </NavLink>
        </li>
        {user?.roles === "Author" && (
          <li className="flex hover:bg-gray-100 p-1.5">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center ${isActive ? "text-amber-500" : ""}`
              }
            >
              <FaTachometerAlt className="mr-1.5 text-amber-400 text-xl" />
              Dashboard
            </NavLink>
          </li>
        )}
      </ul>
    </>
  );
}

export default DropDownNav;

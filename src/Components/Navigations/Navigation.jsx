import { useContext } from "react";
import { FaUser, FaUserPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import { FaHome, FaSignInAlt, FaTachometerAlt } from "react-icons/fa";
const Navigation = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <ul className="uppercase flex justify-end xl:space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center ${isActive ? "text-amber-500" : ""}`
            }
          >
            <FaHome className="mr-1.5 text-amber-400" />
            home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center ${isActive ? "text-amber-500" : ""}`
            }
          >
            <FaUser className="mr-1.5 text-amber-400" />
            profile
          </NavLink>
        </li>
        {user ? (
          ""
        ) : (
          <li>
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `flex items-center ${isActive ? "text-amber-500" : ""}`
              }
            >
              <FaSignInAlt className="mr-1.5 text-amber-400" />
              Sign in
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `flex items-center ${isActive ? "text-amber-500" : ""}`
            }
          >
            <FaUserPlus className="mr-1.5 text-amber-400" />
            Register
          </NavLink>
        </li>
        {user?.roles === "Author" && (
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center ${isActive ? "text-amber-500" : ""}`
              }
            >
              <FaTachometerAlt className="mr-1.5 text-amber-400" />
              Dashboard
            </NavLink>
          </li>
        )}
      </ul>
    </>
  );
};

export default Navigation;

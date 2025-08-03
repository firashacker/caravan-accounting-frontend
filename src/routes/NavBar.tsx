import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHammer,
  //faBucket,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import logo from "../assets/Caravan.svg";
const mapNavElements = [
  {
    id: 2,
    title: "العمال",
    path: "/employees",
    icon: faHammer,
  },
  {
    id: 1,
    title: "الصفحة الرئيسية",
    path: "/",
    icon: faHouse,
  },
];

function Navbar() {
  const [menu, setMenu] = useState("hidden");
  const pathname = useLocation().pathname;
  const showMenu = () => {
    if (menu === "hidden") setMenu("");
    else setMenu("hidden");
  };

  return (
    <>
      <nav
        id="navbar"
        className="bg-white shadow-lg w-full z-10  fixed   top-0 left-0 right-0 h-18 "
      >
        <div className="container mx-auto flex justify-between items-center px-4 py-2 md:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="invisible md:visible flex text-xl font-bold text-gray-800 hover:text-blue-500 transition-colors duration-200 pb-2"
          >
            <img className="max-h-15" src={logo} />
            <h1 className="flex flex-col min-h-full justify-center px-2">
              {import.meta.env.VITE_PAGE_TITLE}
            </h1>
          </Link>

          {/* Desktop Navigation Items - hidden on small screens */}
          <ul className=" hidden  xl:flex  mt-3 space-x-6 space-y-6 ">
            {mapNavElements.map((navElement) => (
              <li key={navElement.id}>
                <Link
                  to={navElement.path}
                  className={` text-black py-2  px-4 rounded hover:opacity-90 transition duration-300  font-semibold
                  ${
                    pathname == navElement.path
                      ? "bg-gradient-to-bl from-purple-300 to-blue-600" //"text-blue font-extrabold border-transparent border-b-blue-600 border-0 border-b-2"
                      : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={navElement.icon}
                    size="lg"
                    className="mr-1"
                  />
                  {navElement.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile menu button for small screens */}
          <button
            type="button"
            onClick={showMenu}
            className="xl:hidden  text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 8h7"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (hidden by default, shown on small screens) */}
      <ul
        className={`${menu} xl:hidden bg-white shadow-md  z-20 w-auto top-20 right-0  flex-col m-8 p-8 px-full fixed `}
      >
        {mapNavElements.map((navElement) => (
          <li
            key={navElement.id}
            className={` flex py-3  border-gray-100 px-4 rounded hover:opacity-90 transition duration-300 font-semibold
          ${
            pathname === navElement.path
              ? "bg-gradient-to-bl from-yellow-500 to-orange-600" //"text-blue font-extrabold border-transparent border-b-blue-600 border-0 border-b-2"
              : ""
          }`}
          >
            <Link
              onClick={showMenu}
              to={navElement.path}
              className={` text-xl font-semibold text-gray-700 w-full h-full`}
            >
              <FontAwesomeIcon
                icon={navElement.icon}
                size="lg"
                className="mr-1"
              />
              {navElement.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Navbar;

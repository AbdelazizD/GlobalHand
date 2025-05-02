import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isVolunteer, loading } = useAuth() || { user: null, isVolunteer: false, loading: true };

  // 👇 Dynamic Home Link based on login state
  const dynamicHomeLink = { path: user ? "/dashboard" : "/", label: "Home" };

  // 👇 Common Links updated to include dynamicHomeLink
  const commonLinks = [
    dynamicHomeLink,
    { path: "/leaderboards", label: "Leaderboards" },
    { path: "/how-it-works", label: "How it Works" },
  ];

  const requestHelpLink = { path: "/request", label: "Request Help" };
  const browseTasksLink = { path: "/browse", label: "Browse Tasks" };

  if (loading) {
    return (
      <nav className="bg-white shadow-sm sticky top-0 z-50 animate-pulse">
        {/* ...unchanged loading skeleton... */}
      </nav>
    );
  }

  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const getNavLinkClass = ({ isActive }) =>
    `px-1 py-0.5 transition-colors duration-150 ease-in-out ${
      isActive
        ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
        : 'text-gray-600 hover:text-emerald-700'
    }`;

  const getMobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out ${
      isActive
        ? 'bg-emerald-50 text-emerald-800'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  let allLinks = [...commonLinks];
  if (user) {
    allLinks.push(isVolunteer ? browseTasksLink : requestHelpLink);
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 👇 Logo now also dynamically redirects */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to={user ? "/dashboard" : "/"}
              className="text-2xl font-bold text-emerald-700 hover:text-emerald-800 transition-colors relative inline-block gaza-glow"
            >
              Kindred
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:ml-6 md:space-x-6 lg:space-x-8">
            {allLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={getNavLinkClass}
                // Use 'end' prop carefully, especially for the home link
                end={link.path === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Section: Auth Buttons or User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-md border border-emerald-600 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors duration-150 ease-in-out"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-md bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 transition-colors duration-150 ease-in-out"
                >
                  Login
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                 {/* Display User Name/Email */}
                 <span className="text-sm text-gray-600 hidden lg:inline">
                   Hi, {user.displayName?.split(' ')[0] || user.email}
                 </span>
                 <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-150 ease-in-out"
                    >
                    Logout
                 </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close main menu" : "Open main menu"}
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? 'max-h-96 border-t border-gray-200' : 'max-h-0'}
        `}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {allLinks.map((link) => (
            <NavLink
              key={`mobile-${link.path}`}
              to={link.path}
              className={getMobileNavLinkClass}
              onClick={closeMenu} // Close menu on link click
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        {/* Mobile Auth Section */}
        <div className="pt-3 pb-3 border-t border-gray-200 px-2 sm:px-3">
          {!user ? (
            <div className="space-y-2">
              <Link
                to="/signup"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2 rounded-md border border-emerald-600 text-base font-medium text-emerald-600 hover:bg-emerald-50"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2 rounded-md bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                 {/* Optional: Add icon back if desired */}
                 {/* <UserCircleIcon className="h-8 w-8 text-gray-400"/> */}
                 <span className="text-sm font-medium text-gray-700">
                   {user.displayName?.split(' ')[0] || user.email}
                 </span>
              </div>
               <button
                onClick={handleLogout} // Already closes menu
                className="ml-auto px-3 py-1 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
               >
                Logout
               </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
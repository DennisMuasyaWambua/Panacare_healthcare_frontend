import React, { useState, useEffect } from "react";
import { User, LogOut, Bell, HelpCircle, ChevronDown, Star } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { usePathname } from "next/navigation";
import { notificationsAPI } from "../../utils/api";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    // Just call logout - navigation is now handled in the AuthContext
    logout();
  };

  const pathname = usePathname();
  const isDashboardIndex = pathname === "/dashboard";

  const getPageName = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 1
      ? parts[parts.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
      : "Dashboard";
  };

  const getInitials = () => {
    if (!user) return "U";
    const first = user.first_name ? user.first_name.charAt(0) : "";
    const last = user.last_name ? user.last_name.charAt(0) : "";
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getHistory({ is_read: false });
      if (response && response.status === "success") {
        setUnreadCount(response.count || (response.data ? response.data.length : 0));
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Left Section */}
      <div>
        {isDashboardIndex ? (
          <h1 className="text-lg font-medium text-[#7F375E]"> </h1>
        ) : (
          <h1 className="text-lg font-medium text-[#7F375E]">{getPageName()}</h1>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Help Icon */}
        <button className="text-gray-600 hover:text-gray-900">
          <HelpCircle className="w-6 h-6" />
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-bold text-black font-['Poppins']">KEN</span>
          <div className="w-6 h-4 relative overflow-hidden rounded-sm border border-gray-200">
            <Image
              src="/Flag_of_Kenya.svg_1.png"
              alt="Kenyan Flag"
              fill
              className="object-cover"
            />
          </div>
          <ChevronDown size={14} className="text-gray-600" />
        </div>

        {/* Accessibility Icon */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 bg-black text-white flex items-center justify-center rounded-sm text-xs font-bold">
            A
          </div>
          <Star size={10} className="text-black fill-black" />
          <span className="text-xs font-bold text-black font-['Poppins']">EN</span>
          <ChevronDown size={14} className="text-gray-600" />
        </div>


        {/* Notification Bell with Dropdown */}
        <div className="relative notification-container">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="w-6 h-6 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-200 bg-[#7F375E] flex items-center justify-center text-white font-medium text-sm">
            {user?.profile_image ? (
              <Image
                src={user.profile_image}
                alt="Profile"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
        </div>
        {/* Logout removed from header based on mockup? Keeping it just in case but hidden visually if needed or just minimal */}
      </div>
    </div>
  );
};

export default Navbar;
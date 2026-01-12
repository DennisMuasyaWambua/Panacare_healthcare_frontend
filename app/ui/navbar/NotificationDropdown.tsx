"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, X, Bell, Calendar, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { notificationsAPI } from "../../utils/api";
import { toast } from "react-toastify";

const NotificationDropdown = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await notificationsAPI.getHistory();
            if (response && response.status === "success") {
                const fetchedNotifications = (response.data || []).map(n => ({
                    id: n.id,
                    type: n.notification_type,
                    title: n.title,
                    message: n.body,
                    timestamp: n.created_at,
                    read: n.is_read
                }));
                setNotifications(fetchedNotifications);
                setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            // Don't show toast for every fetch error in background, but maybe on manual refresh
        } finally {
            setIsLoading(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now.getTime() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) {
            return `${minutes} Minute${minutes !== 1 ? 's' : ''} Ago`;
        } else if (hours < 24) {
            return `${hours} Hour${hours !== 1 ? 's' : ''} Ago`;
        } else {
            return `${days} Day${days !== 1 ? 's' : ''} Ago`;
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await notificationsAPI.markAsRead(notificationId);
            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            toast.error("Failed to mark all as read");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        You Have {unreadCount} Unread Message{unreadCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#29AAE1] hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#29AAE1]"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No notifications yet
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const IconComponent = notification.type === 'appointment' ? Calendar :
                            notification.type === 'announcement' ? Info :
                                notification.type === 'emergency' ? ShieldAlert :
                                    notification.type === 'payment' ? CheckCircle2 : Bell;

                        return (
                            <div
                                key={notification.id}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                                className={`px-6 py-4 hover:bg-gray-50 border-b border-gray-100 flex items-start gap-4 cursor-pointer transition-colors ${!notification.read ? 'bg-[#F0F7FF]' : ''
                                    }`}
                            >
                                <div className={`p-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-[#29AAE1]/10 text-[#29AAE1]' : 'bg-gray-100 text-gray-400'}`}>
                                    <IconComponent size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-[14px] leading-tight ${!notification.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                        {notification.title || "New Notification"}
                                    </p>
                                    <p className="text-[13px] text-gray-500 mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-2 font-medium">
                                        {formatTimestamp(notification.timestamp)}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-[#29AAE1] rounded-full mt-2 flex-shrink-0"></div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer - prominent "View All" button */}
            {/* <div className="px-6 py-4 border-t border-gray-200">
                <Link
                    href="/dashboard/notifications"
                    onClick={onClose}
                    className="w-full py-2.5 bg-[#7F375E] text-white rounded-lg font-bold text-sm hover:bg-[#6c2e50] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    View All Notifications
                </Link>
            </div> */}
        </div>
    );
};

export default NotificationDropdown;
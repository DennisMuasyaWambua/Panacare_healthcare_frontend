"use client";
import React, { useState, useEffect } from "react";
import {
    Bell,
    History,
    Send,
    Settings,
    CheckCircle2,
    Info,
    ShieldAlert,
    Calendar,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Eye,
    Check
} from "lucide-react";
import { notificationsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState("history");
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [preferences, setPreferences] = useState({});
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    // Form state for sending notifications
    const [sendForm, setSendForm] = useState({
        recipient_type: "user",
        user_id: "",
        role: "doctor",
        title: "",
        body: "",
        notification_type: "general",
        save_to_history: true
    });
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchHistory();
        fetchPreferences();
    }, []);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const response = await notificationsAPI.getHistory();
            if (response && response.status === "success") {
                setNotifications(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            toast.error("Failed to load notification history");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPreferences = async () => {
        try {
            const response = await notificationsAPI.getPreferences();
            if (response && response.status === "success") {
                setPreferences(response.data || {});
            }
        } catch (error) {
            console.error("Error fetching preferences:", error);
        }
    };

    const handleSendSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const payload = { ...sendForm };
            if (payload.recipient_type !== "user") delete payload.user_id;
            if (payload.recipient_type !== "role") delete payload.role;

            const response = await notificationsAPI.sendNotification(payload);
            if (response && response.status === "success") {
                toast.success("Notification sent successfully");
                setSendForm({
                    recipient_type: "user",
                    user_id: "",
                    role: "doctor",
                    title: "",
                    body: "",
                    notification_type: "general",
                    save_to_history: true
                });
                fetchHistory(); // Refresh history
            }
        } catch (error) {
            console.error("Error sending notification:", error);
            toast.error("Failed to send notification");
        } finally {
            setIsSending(false);
        }
    };

    const handlePreferenceToggle = async (key) => {
        const updatedPrefs = { ...preferences, [key]: !preferences[key] };
        setPreferences(updatedPrefs);

        try {
            setIsSavingPrefs(true);
            await notificationsAPI.updatePreferences(updatedPrefs);
            toast.success("Preferences updated");
        } catch (error) {
            console.error("Error updating preferences:", error);
            toast.error("Failed to update preferences");
            // Rollback
            setPreferences(preferences);
        } finally {
            setIsSavingPrefs(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            toast.error("Failed to mark notification as read");
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'appointment': return <Calendar className="text-blue-500" size={20} />;
            case 'announcement': return <Info className="text-purple-500" size={20} />;
            case 'emergency': return <ShieldAlert className="text-red-500" size={20} />;
            case 'payment': return <CheckCircle2 className="text-green-500" size={20} />;
            default: return <Bell className="text-gray-400" size={20} />;
        }
    };

    return (
        <div className="p-8 bg-gray-50/30 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#7F375E]">Notifications</h1>
                    <p className="text-gray-500 mt-1">Manage your system alerts and communication</p>
                </div>
                {isAdmin && activeTab === 'history' && (
                    <button
                        onClick={() => setActiveTab('send')}
                        className="px-5 py-2.5 bg-[#29AAE1] text-white rounded-lg font-bold text-[13px] hover:bg-[#2399c9] transition-all flex items-center gap-2"
                    >
                        <Send size={16} />
                        Send New Notification
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-white p-1 rounded-xl border border-gray-100 w-fit">
                <button
                    onClick={() => setActiveTab("history")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "history"
                            ? "bg-[#7F375E] text-white shadow-md"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                >
                    <History size={18} />
                    History
                </button>
                {isAdmin && (
                    <button
                        onClick={() => setActiveTab("send")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "send"
                                ? "bg-[#7F375E] text-white shadow-md"
                                : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        <Send size={18} />
                        Send Notification
                    </button>
                )}
                <button
                    onClick={() => setActiveTab("preferences")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "preferences"
                            ? "bg-[#7F375E] text-white shadow-md"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                >
                    <Settings size={18} />
                    Preferences
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden min-h-[500px]">
                {activeTab === "history" && (
                    <div className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
                                <p className="mt-4 text-gray-500 font-medium">Loading history...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                <div className="bg-gray-50 p-6 rounded-full mb-4">
                                    <Bell size={48} className="text-gray-300" />
                                </div>
                                <p className="text-xl font-bold text-gray-800">No Notifications</p>
                                <p className="text-gray-500 mt-2 max-w-sm">You don't have any notification history at the moment.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FAFAFA] border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[13px] font-bold text-gray-700">Type</th>
                                            <th className="px-6 py-4 text-[13px] font-bold text-gray-700">Message</th>
                                            <th className="px-6 py-4 text-[13px] font-bold text-gray-700">Status</th>
                                            <th className="px-6 py-4 text-[13px] font-bold text-gray-700">Sent Date</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-gray-600">
                                        {notifications.map((n) => (
                                            <tr key={n.id} className={`hover:bg-gray-50/50 transition-colors ${!n.is_read ? 'bg-[#F0F7FF]/30' : ''}`}>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-white border border-gray-100 shadow-sm">
                                                            {getIcon(n.notification_type)}
                                                        </div>
                                                        <span className="capitalize font-bold text-[13px] text-gray-700">{n.notification_type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <p className={`text-[14px] leading-tight ${!n.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                            {n.title}
                                                        </p>
                                                        <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">{n.body}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${n.is_read ? 'bg-gray-100 text-gray-500' : 'bg-[#E1F3F9] text-[#29AAE1]'
                                                        }`}>
                                                        {n.is_read ? 'Read' : 'Unread'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-[13px] font-medium text-gray-400">
                                                    {new Date(n.created_at).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => !n.is_read && markAsRead(n.id)}
                                                        disabled={n.is_read}
                                                        className={`p-2 rounded-lg transition-all ${n.is_read ? 'text-gray-300' : 'text-[#29AAE1] hover:bg-[#E1F3F9]'
                                                            }`}
                                                        title="Mark as read"
                                                    >
                                                        <Check size={18} strokeWidth={3} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "send" && isAdmin && (
                    <div className="p-8 max-w-2xl mx-auto">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#7F375E]">Send New Notification</h3>
                            <p className="text-gray-500 text-sm mt-1">Broadcast messages to users, roles, or the entire system.</p>
                        </div>

                        <form onSubmit={handleSendSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-700">Recipient Type</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] text-sm"
                                        value={sendForm.recipient_type}
                                        onChange={(e) => setSendForm({ ...sendForm, recipient_type: e.target.value })}
                                    >
                                        <option value="user">Specific User</option>
                                        <option value="role">By Role</option>
                                        <option value="all">All Users</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-700">Notification Type</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] text-sm"
                                        value={sendForm.notification_type}
                                        onChange={(e) => setSendForm({ ...sendForm, notification_type: e.target.value })}
                                    >
                                        <option value="general">General</option>
                                        <option value="appointment">Appointment</option>
                                        <option value="announcement">Announcement</option>
                                        <option value="emergency">Emergency</option>
                                        <option value="payment">Payment</option>
                                    </select>
                                </div>
                            </div>

                            {sendForm.recipient_type === "user" && (
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-700">User ID</label>
                                    <input
                                        type="number"
                                        placeholder="Enter recipient User ID"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] text-sm"
                                        value={sendForm.user_id}
                                        onChange={(e) => setSendForm({ ...sendForm, user_id: e.target.value })}
                                        required
                                    />
                                </div>
                            )}

                            {sendForm.recipient_type === "role" && (
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-700">Target Role</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] text-sm"
                                        value={sendForm.role}
                                        onChange={(e) => setSendForm({ ...sendForm, role: e.target.value })}
                                    >
                                        <option value="doctor">Doctors</option>
                                        <option value="patient">Patients</option>
                                        <option value="admin">Administrators</option>
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-gray-700">Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter notification title"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] text-sm"
                                    value={sendForm.title}
                                    onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-gray-700">Message Body</label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter your message here..."
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#29AAE1]/20 focus:border-[#29AAE1] text-sm resize-none"
                                    value={sendForm.body}
                                    onChange={(e) => setSendForm({ ...sendForm, body: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="save_hist"
                                    className="w-4 h-4 rounded border-gray-300 text-[#7F375E] focus:ring-[#7F375E]"
                                    checked={sendForm.save_to_history}
                                    onChange={(e) => setSendForm({ ...sendForm, save_to_history: e.target.checked })}
                                />
                                <label htmlFor="save_hist" className="text-sm text-gray-600 font-medium cursor-pointer">
                                    Save to history for recipients
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-3 bg-[#7F375E] text-white rounded-xl font-bold hover:bg-[#6c2e50] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                            >
                                {isSending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Notification
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === "preferences" && (
                    <div className="p-8 max-w-2xl mx-auto">
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-[#7F375E]">Notification Preferences</h3>
                            <p className="text-gray-500 text-sm mt-1">Choose how and when you want to be notified.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                                    <Bell size={16} className="text-[#29AAE1]" />
                                    Push Notifications
                                </h4>
                                <div className="space-y-5 px-2">
                                    {[
                                        { key: 'push_appointments', label: 'Appointment Reminders' },
                                        { key: 'push_consultations', label: 'Teleconsultation Updates' },
                                        { key: 'push_payments', label: 'Payment Receipts' },
                                        { key: 'push_emergency', label: 'Emergency Alerts', critical: true },
                                        { key: 'push_general', label: 'General Updates' }
                                    ].map(pref => (
                                        <div key={pref.key} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[14px] font-bold text-gray-700">{pref.label}</p>
                                                {pref.critical && <p className="text-[11px] text-red-400 font-medium">Highly recommended</p>}
                                            </div>
                                            <button
                                                onClick={() => handlePreferenceToggle(pref.key)}
                                                className={`w-11 h-6 rounded-full relative transition-all duration-300 ${preferences[pref.key] ? 'bg-[#34A853]' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${preferences[pref.key] ? 'right-1' : 'left-1'
                                                    }`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                                    <Send size={16} className="text-[#7F375E]" />
                                    Email Notifications
                                </h4>
                                <div className="space-y-5 px-2">
                                    {[
                                        { key: 'email_appointments', label: 'Appointment Summaries' },
                                        { key: 'email_consultations', label: 'Consultation Reports' }
                                    ].map(pref => (
                                        <div key={pref.key} className="flex items-center justify-between">
                                            <p className="text-[14px] font-bold text-gray-700">{pref.label}</p>
                                            <button
                                                onClick={() => handlePreferenceToggle(pref.key)}
                                                className={`w-11 h-6 rounded-full relative transition-all duration-300 ${preferences[pref.key] ? 'bg-[#34A853]' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${preferences[pref.key] ? 'right-1' : 'left-1'
                                                    }`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;

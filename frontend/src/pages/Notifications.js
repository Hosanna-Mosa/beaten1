import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  API_ENDPOINTS,
  getApiConfig,
  handleApiResponse,
  handleApiError,
} from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view notifications.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios(
          getApiConfig(API_ENDPOINTS.USER_NOTIFICATIONS)
        );
        const data = handleApiResponse(response);
        setNotifications(data.data || []);
      } catch (err) {
        setError(handleApiError(err).message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((notif) => (notif._id === id ? { ...notif, read: true } : notif))
    );
    try {
      await axios(
        getApiConfig(API_ENDPOINTS.USER_NOTIFICATION_MARK_READ(id), "PATCH")
      );
      // No need to update state again, already done
    } catch (err) {
      // Optionally handle error: revert UI if needed
    }
  };

  return (
    <div
      className="notifications-page"
      style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}
    >
      <h2>Notifications</h2>
      {loading ? (
        <div>Loading notifications...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : notifications.length === 0 ? (
        <div>No notifications found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((notif) => (
            <li
              key={notif._id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                marginBottom: 16,
                padding: 16,
                background: notif.read ? "#f9f9f9" : "#e6f7ff",
              }}
            >
              <div style={{ fontWeight: notif.read ? "normal" : "bold" }}>
                {notif.message}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {notif.type} •{" "}
                {notif.createdAt
                  ? new Date(notif.createdAt).toLocaleString()
                  : ""}
              </div>
              {!notif.read && (
                <button
                  style={{ marginTop: 8 }}
                  onClick={() => markAsRead(notif._id)}
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

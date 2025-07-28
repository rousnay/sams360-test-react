import React, { useState, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";

const NotificationListener = ({ userId, manageAccountId }) => {
  const [notifications, setNotifications] = useState([]);

  const handleNotification = useCallback((newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const { connected } = useSocket(
    { userId, manageAccountId },
    handleNotification
  );

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <strong>WebSocket Status:</strong>{" "}
        <span
          style={{ color: connected ? "green" : "red", fontWeight: "bold" }}
        >
          {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </span>
      </div>

      <h3>Notifications</h3>
      <ul>
        {notifications.map((n, index) => (
          <li key={n.created_at + "-" + index}>
            <strong>{n.title}:</strong> {n.message}
            <br />
            <small>{new Date(n.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationListener;

// setNotifications((prev) => {
//   const updated = [newNotification, ...prev];
//   console.log("📬 Notification state updated:", updated);
//   return updated;
// });

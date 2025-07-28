import { useEffect, useRef, useState, useMemo } from "react";
import { io } from "socket.io-client";

export const useSocket = ({ userId, manageAccountId }, onNotification) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const SOCKET_URL = useMemo(() => {
    return localStorage.getItem("websocket_url") || "http://localhost:3012";
  }, []);

  useEffect(() => {
    if (!userId || !manageAccountId) return;

    console.log("🟢 Creating new socket...");

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      console.log("✅ Connected to WebSocket");
      setConnected(true);

      socket.emit("join", {
        userId,
        manageAccountId,
        agentAccountId: null,
      });
    };

    const handleDisconnect = () => {
      console.log("❌ WebSocket disconnected");
      setConnected(false);
    };

    const handleNotification = (data) => {
      console.log("📩 Notification received:", data);
      onNotification?.(data);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);

    return () => {
      console.log("🔌 Cleaning up socket...");

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);

      // 🕒 Wait before disconnecting if not connected yet
      if (socket.connected) {
        socket.disconnect();
      } else {
        setTimeout(() => {
          if (socket.connected || socket.disconnected === false) {
            socket.disconnect();
          }
        }, 300); // Give handshake time to complete
      }

      socketRef.current = null;
      setConnected(false);
    };
  }, [userId, manageAccountId, onNotification, SOCKET_URL]);

  return useMemo(() => ({ socket: socketRef.current, connected }), [connected]);
};

// 🎯 Listen for each specific type
// socket.on("user-notification", (data) => {
//   console.log("👤 User notification received:", data);
//   onNotification?.(data);
// });

// socket.on("manage-notification", (data) => {
//   console.log("🏛️ Manage notification received:", data);
//   onNotification?.(data);
// });

// socket.on("agent-notification", (data) => {
//   console.log("🧑‍💼 Agent notification received:", data);
//   onNotification?.(data);
// });

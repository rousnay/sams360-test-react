import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SingleUpload from "./pages/SingleUpload";
import MultiUpload from "./pages/MultiUpload";
import MultiUploadWithForm from "./pages/MultiUploadWithForm";
import NotificationListener from "./components/NotificationListener";

export default function App() {
  const [baseUrl, setBaseUrl] = useState(
    localStorage.getItem("api_base_url") || ""
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token") || ""
  );
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || "");
  const [manageAccountId, setManageAccountId] = useState(
    localStorage.getItem("manage_account_id") || ""
  );
  const [websocketUrl, setWebsocketUrl] = useState(
    localStorage.getItem("websocket_url") || ""
  );

  const saveSettings = () => {
    localStorage.setItem("api_base_url", baseUrl);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user_id", userId);
    localStorage.setItem("manage_account_id", manageAccountId);
    localStorage.setItem("websocket_url", websocketUrl);
    alert("✅ Settings saved to localStorage");
  };

  useEffect(() => {
    setBaseUrl(localStorage.getItem("api_base_url") || "");
    setAccessToken(localStorage.getItem("access_token") || "");
    setUserId(localStorage.getItem("user_id") || "");
    setManageAccountId(localStorage.getItem("manage_account_id") || "");
    setWebsocketUrl(localStorage.getItem("websocket_url") || "");
  }, []);

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h2>🛠️ API Settings</h2>
        <div>
          <label>Base API URL: </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            style={{ width: "400px", marginRight: "10px" }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Access Token: </label>
          <input
            type="text"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            style={{ width: "400px", marginRight: "10px" }}
          />
        </div>

        <br />
        <nav>
          <Link to="/" style={{ marginRight: "15px" }}>
            Single Upload
          </Link>
          <Link to="/multi-upload" style={{ marginRight: "15px" }}>
            Multi Upload
          </Link>
          <Link to="/multi-upload-form">Multi Upload + Form</Link>
        </nav>

        <Routes>
          <Route path="/" element={<SingleUpload />} />
          <Route path="/multi-upload" element={<MultiUpload />} />
          <Route path="/multi-upload-form" element={<MultiUploadWithForm />} />
        </Routes>

        <hr />

        <h2 style={{ marginTop: "30px" }}>🔌 WebSocket Settings</h2>
        <div>
          <label>User ID: </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: "400px", marginRight: "10px" }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Manage Account ID: </label>
          <input
            type="text"
            value={manageAccountId}
            onChange={(e) => setManageAccountId(e.target.value)}
            style={{ width: "400px", marginRight: "10px" }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>WebSocket URL: </label>
          <input
            type="text"
            value={websocketUrl}
            onChange={(e) => setWebsocketUrl(e.target.value)}
            style={{ width: "400px", marginRight: "10px" }}
          />
        </div>

        <button onClick={saveSettings} style={{ marginTop: "10px" }}>
          💾 Save Settings
        </button>

        <NotificationListener
          userId={userId}
          manageAccountId={manageAccountId}
        />
      </div>
    </Router>
  );
}

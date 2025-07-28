import React, { useState } from "react";

export default function SingleUpload() {
  const [status, setStatus] = useState("");
  const [fileId, setFileId] = useState(null);

  const baseUrl = localStorage.getItem("api_base_url");
  const accessToken = localStorage.getItem("access_token");

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStatus(`📡 Requesting upload URL for ${file.name}...`);

    try {
      const res = await fetch(
        `${baseUrl}/core-platform/storage/get-upload-url`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_name: file.name,
            content_type: file.type,
            file_size: file.size,
            file_purpose: "university_logo_img",
          }),
        }
      );

      const json = await res.json();
      const { id, uploadUrl } = json.data;

      setStatus(`⬆️ Uploading ${file.name}...`);
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      setStatus("✅ Upload successful & confirmed!");
      setFileId(id);
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div>
      <h3>📤 Single File Upload</h3>
      <input type="file" onChange={handleFileSelect} />
      <p>{status}</p>
      {fileId && (
        <p>
          <strong>File ID:</strong> {fileId}
        </p>
      )}
    </div>
  );
}

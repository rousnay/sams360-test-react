import React, { useState } from "react";

export default function MultiUpload() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  const baseUrl = localStorage.getItem("api_base_url");
  const accessToken = localStorage.getItem("access_token");

  const handleFilesUpload = async () => {
    const uploadedIds = [];

    for (const file of files) {
      try {
        setStatus(`📡 Getting upload URL for ${file.name}...`);
        const res = await fetch(`${baseUrl}/files/get-upload-url`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_name: file.name,
            content_type: file.type,
            file_size: file.size,
            file_purpose: "multi_upload",
          }),
        });

        const json = await res.json();
        const { id, uploadUrl } = json.data;

        setStatus(`⬆️ Uploading ${file.name}...`);
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");
        uploadedIds.push(id);
      } catch (err) {
        console.error(err);
        setStatus(`❌ Upload failed for ${file.name}`);
        return;
      }
    }

    setStatus(`✅ All ${uploadedIds.length} files uploaded successfully!`);
  };

  return (
    <div>
      <h2>📁 Multiple File Upload</h2>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />
      <button onClick={handleFilesUpload}>🚀 Upload All</button>
      <p>{status}</p>
    </div>
  );
}

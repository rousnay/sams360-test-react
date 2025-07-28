import React, { useState } from "react";

export default function MultiUpload() {
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const baseUrl = localStorage.getItem("api_base_url");
  const accessToken = localStorage.getItem("access_token");

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    for (const file of selectedFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setStatus(`📡 Getting upload URL for: ${file.name}`);

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
            file_purpose: "due_diligence_doc",
          }),
        }
      );

      const json = await res.json();
      const { id, uploadUrl } = json.data;

      setStatus(`⬆️ Uploading ${file.name}...`);
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("S3 upload failed");

      setUploadedFiles((prev) => [...prev, { id, name: file.name }]);
      setStatus(`✅ ${file.name} uploaded!`);
    } catch (error) {
      console.error(error);
      setStatus(`❌ Failed to upload ${file.name}`);
    }
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      <h3>📤 Multi File Upload (Auto Upload)</h3>
      <input type="file" multiple onChange={handleFileSelect} />
      <p>{status}</p>

      {uploadedFiles.length > 0 && (
        <div>
          <h4>✅ Uploaded Files:</h4>
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file.id}>
                {file.name} — <code>{file.id}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

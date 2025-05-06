import React, { useState } from "react";

export default function MultiUploadWithForm() {
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [status, setStatus] = useState("");

  const baseUrl = localStorage.getItem("api_base_url");
  const accessToken = localStorage.getItem("access_token");

  const handleSubmit = async () => {
    const uploadedFileIds = [];

    for (const file of files) {
      setStatus(`📡 Getting upload URL for ${file.name}...`);

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
        uploadedFileIds.push(id);
      } catch (error) {
        console.error(error);
        setStatus(`❌ Failed to upload ${file.name}`);
        return;
      }
    }

    setStatus("📨 Submitting form...");
    try {
      const formRes = await fetch(
        `${baseUrl}/core-platform/storage/form-uploads`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            file_ids: uploadedFileIds,
          }),
        }
      );

      const final = await formRes.json();
      if (!formRes.ok)
        throw new Error(final.message || "Form submission failed");

      setStatus("✅ Form & files submitted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Form submission failed");
    }
  };

  return (
    <div>
      <h2>📝 Upload Form with Multiple Files</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Title: </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ width: "300px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Description: </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ width: "300px" }}
        />
      </div>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
        style={{ marginBottom: "10px" }}
      />
      <br />

      <button onClick={handleSubmit}>🚀 Submit Form + Files</button>

      <p>{status}</p>
    </div>
  );
}

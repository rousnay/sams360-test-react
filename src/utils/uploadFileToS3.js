export async function uploadFileToS3({
  file,
  filePurpose,
  accessToken,
  backendBaseUrl = "http://localhost:3000",
}) {
  console.log("📄 Starting upload:", file.name);

  // Step 1: Get upload URL
  const uploadUrlRes = await fetch(`${backendBaseUrl}/files/get-upload-url`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_name: file.name,
      content_type: file.type,
      file_size: file.size,
      file_purpose: filePurpose,
    }),
  });

  if (!uploadUrlRes.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { data } = await uploadUrlRes.json();
  const { id, uploadUrl } = data;

  // Step 2: Upload to S3
  const s3Res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!s3Res.ok) {
    throw new Error("S3 upload failed");
  }

  // Step 3: Confirm Upload
  const confirmRes = await fetch(
    `${backendBaseUrl}/files/${id}/confirm-upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!confirmRes.ok) {
    throw new Error("Failed to confirm upload");
  }

  console.log("✅ Upload complete:", id);

  return {
    fileId: id,
    storageKey: uploadUrl.split("?")[0], // optional
  };
}

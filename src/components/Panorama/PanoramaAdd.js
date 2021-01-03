import React, { useState, useEffect } from "react";

export default function PanoramaAdd({ id, type, onUploaded, onError }) {
  if (type !== "node" && type !== "request") throw new Error("Bad type");

  const [inputRef, setInputRef] = useState();

  useEffect(() => {
    if (!inputRef) return;
    const handleUpload = () => {
      try {
        const { files } = inputRef;

        if (!files.length) {
          onUploaded && onUploaded([]);
        }

        const newImages = [];
        for (var i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.addEventListener("loadend", async () => {
            const path =
              type === "node"
                ? `nodes/${id}/${file.name}`
                : `requests/${id}/${file.name}`;
            const image = await uploadImage(id, reader.result, path, file);

            newImages.push(image);
            if (newImages.length === files.length) {
              onUploaded && onUploaded(newImages);
            }
          });
          reader.readAsArrayBuffer(file);
        }
      } catch (error) {
        onError && onError(error);
      }
    };
    inputRef.addEventListener("change", handleUpload);
    inputRef.click();
    return () => {
      inputRef.removeEventListener("change", handleUpload);
    };
  }, [id, type, inputRef, onError, onUploaded]);

  return (
    <input
      ref={(ref) => setInputRef(ref)}
      className="dn"
      type="file"
      multiple
    />
  );
}

async function uploadImage(nodeId, result, path, file) {
  // Get S3 URL
  const { url } = await fetch("/v1/panos/upload", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: path,
      type: file.type,
    }),
  }).then((res) => res.json());

  // Upload image to S3
  await fetch(url, {
    method: "PUT",
    headers: {
      "x-amz-acl": "public-read",
    },
    body: new Blob([result], { type: file.type }),
  });

  // Save url in db
  const panoURL = `https://nycmesh-panos.nyc3.cdn.digitaloceanspaces.com/${path}`;
  const pano = await fetch("/v1/panos", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requestId: nodeId, // TODO: Fix
      panoURL,
    }),
  }).then((res) => res.json());

  return pano;
}

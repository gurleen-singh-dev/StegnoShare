import { useState } from "react";

export default function Embed() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file || !message || !password) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("message", message);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/embed", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Embed failed");

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "stego.png";
      a.click();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (f) => {
    if (f) setFile(f);
  };

  return (
    <>
      <p className="page-tag">// ENCODE</p>

      <h1 className="page-title">Embed Message</h1>

      <p className="page-subtitle">
        Conceal a secret message inside an image using LSB steganography.
      </p>

      <div className="stagno-card">
        <div className="field-group">
          <label className="field-label">Carrier Image</label>

          <div
            className={"drop-zone" + (dragOver ? " drag-over" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileChange(e.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />

            {file ? (
              <>
                <div className="drop-zone-icon">✓</div>

                <div className="drop-zone-filename">{file.name}</div>

                {file.type.startsWith("image/") && (
                  <img
                    className="image-preview"
                    src={URL.createObjectURL(file)}
                    alt="preview"
                  />
                )}
              </>
            ) : (
              <>
                <div className="drop-zone-icon">⊕</div>

                <div className="drop-zone-text">
                  Drop image or <span>click to browse</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Secret Message</label>

          <textarea
            className="stagno-textarea"
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="char-count">{message.length} chars</div>
        </div>

        <div className="field-group">
          <label className="field-label">Password</label>

          <input
            className="stagno-input"
            type="password"
            placeholder="Encryption passphrase"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className={"stagno-btn" + (loading ? " loading" : "")}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Embedding..." : "Embed Message"}
        </button>
      </div>

      {error && <div className="error-card">⚠ {error}</div>}
    </>
  );
}

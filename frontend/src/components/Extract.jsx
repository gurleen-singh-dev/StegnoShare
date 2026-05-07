import { useState } from "react";

export default function Extract() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file || !password) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setResult("");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Extract failed");

      setResult(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (f) => {
    if (f) {
      setFile(f);
      setResult("");
      setError("");
    }
  };

  return (
    <>
      <p className="page-tag">// DECODE</p>

      <h1 className="page-title">Extract Message</h1>

      <p className="page-subtitle">
        Reveal a hidden message concealed inside a steganographic image.
      </p>

      <div className="stagno-card">
        <div className="field-group">
          <label className="field-label">Stego Image</label>

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
          <label className="field-label">Password</label>

          <input
            className="stagno-input"
            type="password"
            placeholder="Decryption passphrase"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className={"stagno-btn" + (loading ? " loading" : "")}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Extracting..." : "Extract Message"}
        </button>
      </div>

      {result && (
        <div className="result-card">
          <div className="result-label">// HIDDEN MESSAGE RECOVERED</div>

          <div className="result-message">{result}</div>
        </div>
      )}

      {error && <div className="error-card">⚠ {error}</div>}
    </>
  );
}

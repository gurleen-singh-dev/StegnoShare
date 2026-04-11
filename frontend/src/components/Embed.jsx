import { useState } from "react";

export default function Embed() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!file || !message || !password) {
      alert("All fields required");
      return;
    }

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
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Embed Message</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />

      <textarea
        placeholder="Enter secret message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Embed</button>
    </div>
  );
}

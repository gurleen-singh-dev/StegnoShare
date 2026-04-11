import { useState } from "react";

export default function Extract() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!file || !password) {
      alert("All fields required");
      return;
    }

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

      alert("Hidden message: " + data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Extract Message</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Extract</button>
    </div>
  );
}

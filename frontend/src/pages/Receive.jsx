import { useState } from "react"

import FileUpload from "../components/FileUpload"
import ImagePreview from "../components/ImagePreview"
import PasswordInput from "../components/PasswordInput"
import ProgressBar from "../components/ProgressBar"

function Receive() {

  const [file, setFile] = useState(null)
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const handleDecode = async () => {

    if (!file) {
      setError("Please upload an image")
      return
    }

    if (!password) {
      setError("Please enter password")
      return
    }

    setError("")
    setProgress(20)

    const formData = new FormData()
    formData.append("image", file)
    formData.append("password", password)

    try {

      const response = await fetch("http://127.0.0.1:8000/decode", {
        method: "POST",
        body: formData
      })

      setProgress(70)

      if (!response.ok) {
        setError("Server error")
        return
      }

      const data = await response.json()

      setProgress(100)

      setMessage(data.message)

    } catch (err) {
      setError("Something went wrong")
    }

  }

  return (
    <div>

      <h2>Receive Secret</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <FileUpload onFileChange={setFile} />

      <ImagePreview file={file} />

      <ProgressBar progress={progress} />

      <br />

      <PasswordInput
        value={password}
        onChange={setPassword}
      />

      <br /><br />

      <button onClick={handleDecode}>
        Decode
      </button>

      <br /><br />

      {message && (
        <div>
          <h3>Hidden Message:</h3>
          <p>{message}</p>
        </div>
      )}

    </div>
  )
}

export default Receive
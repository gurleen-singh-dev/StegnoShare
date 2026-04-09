import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import FileUpload from "../components/FileUpload"
import ImagePreview from "../components/ImagePreview"
import PasswordInput from "../components/PasswordInput"
import ProgressBar from "../components/ProgressBar"

function Send() {

  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const navigate = useNavigate()

  const handleEncode = async () => {

    if (!file) {
      setError("Please upload an image")
      return
    }

    if (!message) {
      setError("Please enter a secret message")
      return
    }

    if (!password) {
      setError("Please enter a password")
      return
    }

    setError("")
    setProgress(20)

    const formData = new FormData()
    formData.append("image", file)
    formData.append("message", message)
    formData.append("password", password)

    try {

      const response = await fetch("http://127.0.0.1:8000/encode", {
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

      console.log(data)

      // Result page par redirect
      navigate("/result", { state: { image: data.image_url } })

    } catch (err) {
      setError("Something went wrong")
    }

  }

  return (
    <div>

      <h2>Send Secret</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <FileUpload onFileChange={setFile} />

      <ImagePreview file={file} />

      <ProgressBar progress={progress} />

      <br />

      <input
        type="text"
        placeholder="Enter secret message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <PasswordInput
        value={password}
        onChange={setPassword}
      />

      <br /><br />

      <button onClick={handleEncode}>
        Encode
      </button>

      <br /><br />

      <Link to="/">
        <button>Back to Home</button>
      </Link>

    </div>
  )
}

export default Send
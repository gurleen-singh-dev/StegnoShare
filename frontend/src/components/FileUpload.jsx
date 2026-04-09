function FileUpload({ onFileChange }) {

    const handleChange = (e) => {
      const file = e.target.files[0]
      onFileChange(file)
    }
  
    return (
      <div>
        <input type="file" accept="image/*" onChange={handleChange} />
      </div>
    )
  }
  
  export default FileUpload
function ImagePreview({ file }) {

    if (!file) return null
  
    const imageUrl = URL.createObjectURL(file)
  
    return (
      <div>
        <h3>Preview:</h3>
        <img src={imageUrl} alt="preview" width="200" />
      </div>
    )
  }
  
  export default ImagePreview
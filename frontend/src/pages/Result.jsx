import { useLocation, Link } from "react-router-dom"

function Result() {

  const location = useLocation()

  const image = location.state?.image

  return (
    <div className="result-container">

      <div className="result-card">

        <h2>Encoded Result</h2>

        {image ? (
          <>
            <img
              src={image}
              alt="Encoded Result"
              width="250"
            />

            <br /><br />

            <a href={image} download>
              <button className="download-btn">
                Download Image
              </button>
            </a>
          </>
        ) : (
          <p>No image available</p>
        )}

        <br /><br />

        <Link to="/">
          <button className="home-btn">
            Back to Home
          </button>
        </Link>

      </div>

    </div>
  )
}

export default Result
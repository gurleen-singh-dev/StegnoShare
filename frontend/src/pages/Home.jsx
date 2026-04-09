import { Link } from "react-router-dom"

function Home() {
    return (
      <div>
        <h1>Image</h1>

        <Link to="/send">
        <button>Send</button></Link>

        <Link to="/receive">
        <button>Receive</button></Link>
      </div>
    )
  }
  
  export default Home
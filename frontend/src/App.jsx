import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Embed from "./components/Embed";
import Extract from "./components/Extract";

function App() {
  return (
    <Router>
      <div>
        <h1>Steganography App</h1>

        {/* Navigation */}
        <nav>
          <Link to="/">Embed</Link> | <Link to="/extract">Extract</Link>
        </nav>

        <hr />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Embed />} />
          <Route path="/extract" element={<Extract />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

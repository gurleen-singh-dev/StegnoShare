import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Embed from "./components/Embed";
import Extract from "./components/Extract";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <div>
        <Layout>
          <Routes>
            <Route path="/" element={<Embed />} />
            <Route path="/extract" element={<Extract />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Send from "./pages/Send"
import Receive from "./pages/Receive"
import Result from "./pages/Result"

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/result" element={<Result />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
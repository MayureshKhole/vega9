import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Canvas from "./pages/Canvas";
import SearchPage from "./pages/SearchPage";
import "bootstrap/dist/css/bootstrap.min.css";
import CanvasPage from "./pages/Canvas";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<SearchPage />} />
          {/* <Route index element={<AdminMayuresh />} /> */}
          <Route path="/canvasPage" element={<CanvasPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Employees from "./routes/Employees";
import Navbar from "./routes/NavBar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="pt-22">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<Employees />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Employees from "./routes/Employees";
import Navbar from "./routes/NavBar";
import EmployeeUpload from "./routes/Employees.upload";
import Employee from "./routes/Employee";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div dir="rtl" className="pt-18  min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/new" element={<EmployeeUpload />} />
            <Route path="/employee/:id" element={<Employee />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

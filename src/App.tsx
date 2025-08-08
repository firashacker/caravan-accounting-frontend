import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Employees from "./routes/Employees";
import Navbar from "./routes/NavBar";
import EmployeeUpload from "./routes/Employees.upload";
import Employee from "./routes/Employee";
import Clients from "./routes/Clients";
import ClientUpload from "./routes/Clients.upload";
import Client from "./routes/Client";
import Traders from "./routes/Traders";
import TradersUpload from "./routes/Traders.upload";
import Trader from "./routes/Trader";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import ProtectedRoute from "./midlewares/PrivateRoute.middleware";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div dir="rtl" className="pt-18  min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/new"
              element={
                <ProtectedRoute>
                  <EmployeeUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/:id/:name/:page"
              element={
                <ProtectedRoute>
                  <Employee />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/new"
              element={
                <ProtectedRoute>
                  <ClientUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id/:name/:page"
              element={
                <ProtectedRoute>
                  <Client />
                </ProtectedRoute>
              }
            />

            <Route
              path="/traders"
              element={
                <ProtectedRoute>
                  <Traders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/traders/new"
              element={
                <ProtectedRoute>
                  <TradersUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/traders/:id/:name/:page"
              element={
                <ProtectedRoute>
                  <Trader />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

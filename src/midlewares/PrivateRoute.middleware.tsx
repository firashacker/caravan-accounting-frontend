// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../state/store";

interface Options {
  children: React.ReactNode | string;
}

const ProtectedRoute = ({ children }: Options) => {
  const { user } = useSelector((state: RootState) => state.auth);
  //console.log(user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;

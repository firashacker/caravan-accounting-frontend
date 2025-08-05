import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import { authLogout } from "../state/Auth/Auth.slice";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(authLogout());
  }, []);
  return <Navigate to="/login" replace />;
};

export default Logout;

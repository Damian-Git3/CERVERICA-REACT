import { Navigate, Outlet } from "react-router-dom";
import useSessionStore from "../stores/useSessionStore";
import axios from "axios";

export const SessionGuard = ({
  redirectTo = "/",
  children,
}: {
  redirectTo?: string;
  children?: any;
}) => {
  const { session } = useSessionStore();

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }
  
  axios.defaults.headers.common["Authorization"] = `Bearer ${session!.token}`;

  return children ? children : <Outlet />;
};

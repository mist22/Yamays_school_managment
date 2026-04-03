import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // assuming React Router
import Login from "./Login"; // your current login component
import { LoaderCircleIcon } from "lucide-react";

const AuthGate = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch(`/api/check-token`, {
          method: "GET",
          credentials: "include", // important to send cookies
        });

        const data = await res.json();

        if (res.ok && data.isAuthenticated) {
          setIsAuthenticated(true);
          navigate("/Home"); // user is logged in, redirect to /Home
        } else {
          setIsAuthenticated(false);
          navigate("/Login"); // token invalid, go to login
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        navigate("/Login");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center flex-col justify-center min-h-screen text-sm font-bold">
        <LoaderCircleIcon size={40}/>
        Checking authentication...
      </div>
    );
  }

  // if not authenticated, show login form
  return !isAuthenticated ? <Login onLoginSuccess={() => navigate("/Home")} /> : null;
};

export default AuthGate;
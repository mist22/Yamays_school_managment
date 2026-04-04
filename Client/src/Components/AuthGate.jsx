import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // assuming React Router
import Login from "./Login"; // your current login component
import { LoaderCircleIcon } from "lucide-react";

const AuthGate = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem('token');
    console.log(token)

    const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/Login");
        return;
      }

      try {
        const res = await fetch(`/api/check-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.isAuthenticated) {
          navigate("/Home");
        } else {
          localStorage.removeItem("token");
          navigate("/Login");
        }
      } catch (err) {
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
  return  null;
};

export default AuthGate;
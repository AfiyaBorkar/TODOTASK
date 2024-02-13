import React, { useState, useEffect } from "react";
import { SignUp, Login, Homepage } from "./pages";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const [token, setToken] = useState(false);
  const [user, setUser] = useState(null);

  let admin = JSON.parse(localStorage.getItem("admininfo"));

  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
    const getUserData = async () => {
      try {
        // const session = supabase.auth.session();
        if (token) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", token.email)
            .single();

          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    getUserData();
  }, []);

  return (
    <div>
      <Routes>
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/"} element={<Login setToken={setToken} />} />
        {token ? (
          <Route path={"/homepage"} element={<Homepage token={token} />} />
        ) : (
          ""
        )}
        {/* {admin ?  */}
        {admin && admin.is_admin ? (
          <Route path={"/admin"} element={<AdminDashboard />} />
        ) : (
          ""
        )}
      </Routes>
    </div>
  );
};

export default App;

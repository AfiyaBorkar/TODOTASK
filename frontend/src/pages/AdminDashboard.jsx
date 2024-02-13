import React, { useEffect, useState } from "react";
import { supabase } from "../client";
import "./mystyle.css";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
// import "react-calendar/dist/Calendar.css";
import LogoutIcon from "@mui/icons-material/Logout";
import TodoChart from "./TodoChart";
import UserChart from "./UserChart";
import UserAdminTodoRatio from "./UserAdminTodoRatio ";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [todosCount, setTodosCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  // const [date, setDate] = useState(new Date());
  const [adminsCount, setAdminsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodosCount();
    fetchUsersCount();
    fetchAdminsCount();
  }, []);

  async function fetchTodosCount() {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("count", { count: "exact" });

      if (error) {
        console.error("Error fetching todos count:", error.message);
        return;
      }

      setTodosCount(data[0]?.count || 0);
    } catch (error) {
      console.error("Error fetching todos count:", error.message);
    }
  }

  async function fetchUsersCount() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("count", { count: "exact" });

      if (error) {
        console.error("Error fetching users count:", error.message);
        return;
      }

      setUsersCount(data[0]?.count || 0);
    } catch (error) {
      console.error("Error fetching users count:", error.message);
    }
  }

  async function fetchAdminsCount() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("count", { count: "exact" })
        .eq("is_admin", true);

      if (error) {
        console.error("Error fetching admins count:", error.message);
        return;
      }

      setAdminsCount(data[0]?.count || 0);
    } catch (error) {
      console.error("Error fetching admins count:", error.message);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    localStorage.removeItem("admininfo");
    navigate("/");
  }

  return (
    <div className="admin-container">
      <div className="adminheader">
        <div className="head">
          <h2>Admin Dashboard</h2>
        </div>
        <hr></hr>
        <div className="options">
          <div className="overviewtab sidetab">
            <h4>Overview</h4>
          </div>
          <div className="analyticstab sidetab">
            <h4>Analytics</h4>
          </div>
        </div>
      </div>

      <div className="dashboarddetials" style={{ margin: "auto" }}>
        <div className="admintitle">
          <div className="heading">
            <h2>Welcome,Admin</h2>
          </div>

          <div className="admin-account">
            <IconButton onClick={handleLogout}>
              <LogoutIcon sx={{ fontSize: 40 }}></LogoutIcon>
            </IconButton>
          </div>
        </div>
        <div className="overview">
          <div className="details">
            <div className="userdetails container-box">
              <div className="usericon">
                <IconButton>
                  <AccountCircleIcon sx={{ fontSize: 50 }}></AccountCircleIcon>
                </IconButton>
              </div>
              <div className="users">
                <h3>Total Users</h3>
                <h5>{usersCount}</h5>
              </div>
            </div>
            <div className="tododetails container-box">
              <div className="usericon">
                <IconButton>
                  <TextSnippetIcon sx={{ fontSize: 50 }}></TextSnippetIcon>
                </IconButton>
              </div>
              <div className="users">
                <h3>Total Todos</h3>
                <h5>{todosCount}</h5>
              </div>
            </div>

            <div className="admindetails container-box">
              <div className="usericon">
                <IconButton>
                  {/* <TextSnippetIcon sx={{ fontSize: 50 }}></TextSnippetIcon> */}
                  <AdminPanelSettingsIcon
                    sx={{ fontSize: 50 }}
                  ></AdminPanelSettingsIcon>
                </IconButton>
              </div>
              <div className="users">
                <h3>Total Admins</h3>
                <h5>{adminsCount}</h5>
              </div>
            </div>
          </div>

          <div className="barchart" style={{ width: "50%" }}>
            {/* <Bar data={barChartData} /> */}
            <TodoChart></TodoChart>
          </div>

          <div className="chartss">
            <div className="linechart">
              {/* <UserChart/> */}
              <UserAdminTodoRatio />
            </div>
            <div className="calendar-container">
              <UserChart />
              {/* <Calendar onChange={setDate} value={date} /> */}
            </div>
          </div>
        </div>
        {/* {todosCount} */}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect, forceUpdate } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import "./mystyle.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, Icon, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const Homepage = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState("");
  const [editedTodoDescription, setEditedTodoDescription] = useState("");
  // const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());
  const [refresh, setRefresh] = useState(false);
  // import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";

  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
    async function fetchTodos() {
      try {
        const { data: todos, error } = await supabase
          .from("todos")
          .select("*")
          .eq("user_id", token.user.id);
        if (error) throw error;
        console.log("Fetched todos:", todos);
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos:", error.message);
      }
    }

    fetchTodos(); // Call fetchTodos when the component mounts
  }, [newTodoTitle]); // Empty dependency array ensures it runs only once

  async function fetchTodos() {
    try {
      const { data: todos, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", token.user.id);
      if (error) {
        console.error("Error fetching todos:", error.message);
        throw error;
      }
      console.log("Fetched todos:", todos); // Log fetched todos for debugging
      setTodos(todos); // Update the todos state with the fetched todos
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  }

  async function addTodo() {
    try {
      const { data, error } = await supabase.from("todos").insert([
        {
          title: newTodoTitle,
          description: newTodoDescription,
          user_id: token.user.id,
        },
      ]);
      if (error) {
        console.error("Error adding todo:", error.message);
        return;
      }
      setRefresh(!refresh);

      setTodos([...todos, data[0]]);
      if (data) {
        fetchTodos(); // Fetch updated todos
      }
      setNewTodoTitle("");
      setNewTodoDescription("");

      // Refresh the page after adding the todo
      // window.location.reload();
      setRefreshTimestamp(Date.now());
      forceUpdate();
    } catch (error) {
      console.error("Error adding todo:", error.message);
    }
  }

  async function deleteTodo(id) {
    try {
      await supabase.from("todos").delete().eq("id", id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  async function editTodo(todoId) {
    setEditingTodoId(todoId);
    const todoToEdit = todos.find((todo) => todo.id === todoId);
    setEditedTodoTitle(todoToEdit.title);
    setEditedTodoDescription(todoToEdit.description);
  }

  async function updateTodo() {
    try {
      // Perform the update operation
      const { data, error } = await supabase
        .from("todos")
        .update({ title: editedTodoTitle, description: editedTodoDescription })
        .eq("id", editingTodoId)
        .single();

      if (error) {
        throw error;
      }

      // Fetch the updated todos after the update operation
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  }

  return (
    <div className="todo">
      <div className="divheader">
        <div className="nametitle">
          <h3>Welcome back, {token.user.user_metadata.full_name}</h3>
        </div>
        <div className="logoutbtn">
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>

      <div className="todoconatiner">
        <div className="inputcont">
          <label>Title</label>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="enter the title of todo"
          />
        </div>

        <div className="inputcont">
          <label>Description</label>
          <input
            type="text"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="enter the description of todo"
          />
        </div>

        <Button
          variant="outlined"
          onClick={() => {
            addTodo();
            setNewTodoTitle("");
            setNewTodoDescription("");
          }}
        >
          Add
        </Button>
      </div>

      <div className="displayTodo" key={refresh}>
        <h2>Todos</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>
                  {editingTodoId === todo.id ? (
                    <input
                      type="text"
                      value={editedTodoTitle}
                      onChange={(e) => setEditedTodoTitle(e.target.value)}
                    />
                  ) : (
                    todo.title
                  )}
                </td>
                <td>
                  {editingTodoId === todo.id ? (
                    <input
                      type="text"
                      value={editedTodoDescription}
                      onChange={(e) => setEditedTodoDescription(e.target.value)}
                    />
                  ) : (
                    todo.description
                  )}
                </td>
                <td>
                  {editingTodoId === todo.id ? (
                    <>
                      <div className="iconss">
                        <IconButton onClick={updateTodo}>
                          <SaveIcon sx={{ fontSize: 20 }} />
                        </IconButton>

                        <IconButton onClick={() => setEditingTodoId(null)}>
                          <CancelIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="iconss">
                        <IconButton onClick={() => editTodo(todo.id)}>
                          <EditIcon sx={{ fontSize: 20 }} />
                        </IconButton>

                        <IconButton onClick={() => deleteTodo(todo.id)}>
                          <DeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        {/* <button >Delete</button> */}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homepage;

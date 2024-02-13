import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  console.log(formData);

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }
  async function addUserToUsersTable(formData) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add user to users table");
      }

      const data = await response.json();
      console.log("Added user to users table:", data);
    } catch (error) {
      console.error("Error adding user to users table:", error.message);
      throw error;
    }
  }

  // async function handleSubmit(e) {
  //   e.preventDefault();

  //   try {
  //     const { user, error } = await supabase.auth.signUp({
  //       email: formData.email,
  //       password: formData.password,
  //       options: {
  //         data: {
  //           full_name: formData.fullName,
  //         },
  //       },
  //     });

  //     if (error) throw error;

  //     // Store the user in the users table after successful sign up
  //     await storeUserInUsersTable(formData.email);

  //     alert('Check your email for verification link');
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // }
  // async function addUserToUsersTable(email) {
  //   try {
  //     const { data: users, error } = await supabase
  //       .from('auth.users')
  //       .select('id, email')
  //       .eq('email', email)
  //       .single();

  //     if (error) {
  //       throw error;
  //     }

  //     const newUser = {
  //       email: users.email,
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString(),
  //     };

  //     const { data: addedUser, insertError } = await supabase
  //       .from('users')
  //       .insert([newUser]);

  //     if (insertError) {
  //       throw insertError;
  //     }

  //     console.log('Added user:', addedUser);

  //     return addedUser;
  //   } catch (error) {
  //     console.error('Error adding user to users table:', error.message);
  //     throw error;
  //   }
  // }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { user, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (error) throw error;

      // Store the user in the users table after successful sign up
      await addUserToUsersTable(formData);

      alert("Check your email for verification link");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>SignUp</h2> <LoginIcon />
        <input placeholder="Fullname" name="fullName" onChange={handleChange} />
        <input placeholder="Email" name="email" onChange={handleChange} />
        <input
          placeholder="Password"
          name="password"
          type="password"
          onChange={handleChange}
        />
        <Button variant="outlined" type="submit">
          Submit
        </Button>
      </form>
      Already have an account?<Link to="/">Login</Link>
    </div>
  );
};

export default SignUp;

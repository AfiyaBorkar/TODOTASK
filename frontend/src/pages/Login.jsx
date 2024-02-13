import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { supabase } from '../client';
import './mystyle.css'
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

const Login = ({setToken}) => {
  let navigate = useNavigate()

  const [formData,setFormData] = useState({
        email:'',password:''
  })

  const [userdata, setuserdata] = useState({})

  // console.log(formData)

  function handleChange(event){
    setFormData((prevFormData)=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value
      }

    })

  }

  async function handleSubmit(e){
    e.preventDefault()

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          })

      if (error) throw error
      // console.log("user data",data.user.email)
      setToken(data)



      if (data) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.user.email)
          .single();

        if (userError) throw userError;
        // console.log("user data from usets",userData)
        setuserdata(userData)
        localStorage.setItem('admininfo',JSON.stringify( userData));

        if (userData && userData.is_admin) {

          // navigate('/admin');
          window.location.href="/admin"
        } else {
          setToken(data);
          navigate('/homepage');
        }
      // navigate('/homepage')

      }
    //   alert('Check your email for verification link')

      
    } catch (error) {
      alert(error)
    }
  }




  return (
    <div className='container' >
      <form onSubmit={handleSubmit} >
        
<h2>login  </h2><LoginIcon />
        <input 
          placeholder='Email'
          name='email'
          onChange={handleChange}
        />

        <input 
          placeholder='Password'
          name='password'
          type="password"
          onChange={handleChange}
        />

        
        <Button  variant="outlined" type='submit'>Submit</Button>


      </form>
      Don't have an account? <Link to='/signup'>Sign Up</Link> 
    </div>
  )
}

export default Login
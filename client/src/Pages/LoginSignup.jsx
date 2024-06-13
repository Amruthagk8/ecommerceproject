import React, { useState } from 'react';
import '../Pages/CSS/LoginSignup.css';

export const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
        let responseData;
        await fetch('http://localhost:5000/api/v1/task/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((data) => {
            responseData = data;
        });

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace('/');
        } else {
            alert(responseData.errors);
        }
    } catch (error) {
        console.error("Login error:", error);
    }
};


  const signup = async () => {
    try {
      let responseData;
      await fetch('http://localhost:5000/api/v1/task/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json()).then((data) => {
        responseData = data;
      });

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign up" && <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Id' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign up" ?
          <p className='loginsignup-login'>Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p> :
          <p className='loginsignup-login'>Create an account? <span onClick={() => { setState("Sign up") }}>Click here</span></p>}
        <div className='loginsignup-agree'>
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
}

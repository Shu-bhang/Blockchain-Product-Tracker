import React, { useState } from "react";

function Login({ setUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if(email === "admin@test.com" && password === "1234"){
      localStorage.setItem("user", email);
      setUser(email);
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div style={{textAlign:"center", marginTop:"100px"}}>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button type="submit">Login</button>

      </form>

    </div>
  );
}

export default Login;
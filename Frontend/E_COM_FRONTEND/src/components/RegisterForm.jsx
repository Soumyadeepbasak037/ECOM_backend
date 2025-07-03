import { useState } from "react";

export default function LoginForm({onLogin,switchToRegister}){
    const [form, setForm] = useState({ username: "", password: "" });

    
  const handleSubmit = async (e) => {
    e.preventDefault();
    onLogin(form); // handled in App
  };

  return(
     <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={switchToRegister}>Register Instead</button>
    </div>
  );
}
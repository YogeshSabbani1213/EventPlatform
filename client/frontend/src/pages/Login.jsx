import { useState, useContext } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const data = await apiRequest("/auth/login", "POST", form);
    if (data.token) {
      login(data);
      navigate("/");
    } else alert(data.message);
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-20 space-y-4">
      <input className="input" placeholder="Email" onChange={e => setForm({...form,email:e.target.value})}/>
      <input className="input" type="password" placeholder="Password" onChange={e => setForm({...form,password:e.target.value})}/>
      <button className="btn">Login</button>
    </form>
  );
}

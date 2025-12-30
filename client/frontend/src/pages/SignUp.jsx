import { useState, useContext } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const data = await apiRequest("/auth/register", "POST", form);
    if (data.token) {
      login(data);
      navigate("/");
    } else alert(data.message);
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-20 space-y-4">
      <input className="input" placeholder="Name"  value={form.username} onChange={e => setForm({...form,username:e.target.value})}/>
      <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
      <input className="input" type="password" placeholder="Password" value={form.password}
 onChange={e => setForm({...form,password:e.target.value})}/>
      <button className="btn">Signup</button>
    </form>
  );
}

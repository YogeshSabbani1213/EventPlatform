import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:"", description:"", dateTime:"", location:"", capacity:"", image:null });

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach(k => fd.append(k, form[k]));
    await apiRequest("/events", "POST", fd, user.token);
    navigate("/");
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 space-y-3">
      {["title","description","dateTime","location","capacity"].map(f =>
        <input key={f} className="input" placeholder={f} onChange={e => setForm({...form,[f]:e.target.value})}/>
      )}
      <input type="file" className='border border-gray-400 w-full' onChange={e => setForm({...form,image:e.target.files[0]})}/>
      <button className="btn">Create</button>
    </form>
  );
}

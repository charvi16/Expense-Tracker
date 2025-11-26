import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

export default function Signup() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e){
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);

      // store token + auto load user
      login(res.data.token);

      navigate("/dashboard");
      
    } catch(err){
      alert(err?.response?.data?.message || "Signup failed");
      console.log("REGISTER ERROR:", err);
    }

    setLoading(false);
  }


  return (
    <main className="page auth-page signup">

      <div className="auth-container">

        <h2>Create your account</h2>

        <form className="auth-form" onSubmit={handleSubmit}>

          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button className="btn-primary auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p className="switch-line">
          Already have an account?
          <span className="switch" onClick={()=> navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </main>
  );
}

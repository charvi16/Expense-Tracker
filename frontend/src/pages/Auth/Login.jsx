import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      login(res.data.token);

      navigate("/dashboard");
      
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
      console.log("LOGIN ERROR:", err);
    }

    setLoading(false);
  }

  return (
    <main className="page auth-page">

      <div className="auth-left">
        <h1>Welcome Back!</h1>
        <p>Your financial dashboard awaits.</p>

        <div className="auth-highlights">
          <div>
            <h3>Track</h3>
            <p>every rupee spent</p>
          </div>
          <div>
            <h3>Predict</h3>
            <p>cashflow with AI</p>
          </div>
          <div>
            <h3>Save</h3>
            <p>smarter than ever</p>
          </div>
        </div>
      </div>

      <div className="auth-card">

        <h2>Login to your account</h2>

        <form className="auth-form" onSubmit={handleSubmit}>

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

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          
        </form>

        <p className="switch">
          New here? <Link to="/signup">Create account</Link>
        </p>
      </div>

    </main>
  );
}

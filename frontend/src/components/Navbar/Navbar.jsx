import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  const refreshUser = localStorage.getItem("refreshUser");

  const [openMenu, setOpenMenu] = useState(false);

function toggleMenu(){
  setOpenMenu(!openMenu);
}

const menuRef = useRef(null);

useEffect(() => {
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenu(false);
    }
  }

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);



  useEffect(() => {
    API.get("/profile").then(res => {
 setProfile(res.data)
})
  }, [refreshUser]);

  if (!user || !profile) return null;

  return (
  <nav className="navbar">

    <div className="nav-logo">
      FinTrack<span>AI</span>
    </div>

    <div className="nav-links">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/expense">Expense</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/advisor">AI Advisor</Link>
    </div>

    <div className="nav-auth">

  <div className="avatar-wrapper" ref={menuRef}>
    <img 
      src={profile.image || "/default-profile.png"}
      className="nav-avatar"
      onClick={() => setOpenMenu(!openMenu)}
    />

    <div className={`dropdown-menu ${openMenu ? "show" : ""}`}>
      <Link to="/profile" onClick={()=>setOpenMenu(false)}>Profile</Link>
      <button onClick={() => { setOpenMenu(false); logout(); }}>Logout</button>
    </div>
  </div>

</div>


  </nav>
);
}

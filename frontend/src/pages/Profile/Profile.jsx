import "./Profile.css";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

export default function Profile() {
  const { refreshUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const refreshKey = localStorage.getItem("refreshProfile");

  useEffect(() => {
    API.get("/profile")
      .then(res => setProfile(res.data))
      .catch(() => {});
  }, [refreshKey]);


  function handleChange(e){
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleSave(e){
    e.preventDefault();

    await API.put("/profile", profile);

    localStorage.setItem("refresh", Date.now());
    localStorage.setItem("refreshUser", Date.now());

    setEditMode(false);
  }

  async function uploadPhoto(e){
    const file = e.target.files[0];
    if(!file) return;

    const form = new FormData();
    form.append("image", file);

    const res = await API.put("/profile/photo", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setProfile(prev=>({...profile, image: res.data.image}));
    refreshUser();
  }


  if(!profile)
    return <main className="page profile-page">Loading...</main>

  return (
    <main className="page profile-page">

      <div className="profile-center">

        <img 
          src={profile.image || "/default-profile.png"}
          className="profile-photo"
        />

        <h2 className="profile-name">{profile.name}</h2>

        {!editMode && (
          <button 
            className="profile-edit-btn"
            onClick={()=> setEditMode(true)}
          >
            Edit Profile
          </button>
        )}

      </div>


      {editMode && (
        <form className="profile-form" onSubmit={handleSave}>

          <label>
            Profile Photo
            <input type="file" name="image" onChange={uploadPhoto} />
          </label>

          <label>
            Name
            <input 
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Currency
            <select
              name="currency"
              value={profile.currency}
              onChange={handleChange}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>

          <label>
            Monthly Budget ₹
            <input
              type="number"
              name="monthlyBudget"
              value={profile.monthlyBudget}
              onChange={handleChange}
            />
          </label>

          <label>
            Monthly Income ₹
            <input
              type="number"
              name="income"
              value={profile.income}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="profile-save-btn">
            Save Changes
          </button>

        </form>
      )}

    </main>
  );
}

import "./Profile.css";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

export default function Profile() {
  const { refreshUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const refreshKey = localStorage.getItem("refreshProfile");

  const [subscription, setSubscription] = useState({
  subName: "",
  subAmount: "",
  subCycle: "monthly",
  subDate: ""
});

function handleSubscriptionChange(e) {
  setSubscription({
    ...subscription,
    [e.target.name]: e.target.value
  });
}


  useEffect(() => {
    setLoading(true);
    API.get("/profile")
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refreshKey]);


  function handleChange(e){
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleSave(e){
    e.preventDefault();
    setSaveLoading(true);

    try {
      await API.put("/profile", profile);

      localStorage.setItem("refresh", Date.now());
      localStorage.setItem("refreshUser", Date.now());

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditMode(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaveLoading(false);
    }
  }

  async function uploadPhoto(e){
    const file = e.target.files[0];
    if(!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await API.put("/profile/photo", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setProfile(prev=>({...profile, image: res.data.image}));
      setSuccessMessage("Profile picture updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      refreshUser();
    } catch(err) {
      console.error("Upload error:", err);
      setSuccessMessage("Failed to upload picture");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setUploading(false);
    }
  }

  async function addSubscription() {
  try {
    await API.post("/subscriptions", {
      name: subscription.subName,
      amount: subscription.subAmount,
      billingCycle: subscription.subCycle,
      nextBillingDate: subscription.subDate
    });

    // reset
    setSubscription({
      subName: "",
      subAmount: "",
      subCycle: "monthly",
      subDate: ""
    });

    localStorage.setItem("refresh", Date.now());
    localStorage.setItem("refreshExpenses", Date.now());

    alert("Subscription added!");
  } catch (err) {
    console.error("ADD SUB ERROR:", err);
    alert("Subscription failed");
  }
}




  if(loading)
    return <main className="page profile-page"><div className="loading-spinner">Loading...</div></main>

  return (
    <main className="page profile-page">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-image-wrapper">
            <img 
              src={profile.image || "/default-profile.png"}
              className="profile-photo"
              alt="Profile"
            />
            <label className="photo-upload-label" title="Click to upload profile picture">
              <input 
                type="file" 
                name="image" 
                onChange={uploadPhoto}
                disabled={uploading}
                accept="image/*"
              />
              <span>{uploading ? '⏳' : '✎'}</span>
            </label>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Currency</span>
                <span className="stat-value">{profile.currency}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Budget</span>
                <span className="stat-value">{profile.currency} {profile.monthlyBudget}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Income</span>
                <span className="stat-value">{profile.currency} {profile.income}</span>
              </div>
            </div>
          </div>
        </div>

        {!editMode && (
          <div className="profile-actions">
            <button 
              className="btn btn-primary"
              onClick={()=> setEditMode(true)}
            >
              ✎ Edit Profile
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                try {
                  await API.post("/reports/send-now");
                  setSuccessMessage("Monthly report email sent!");
                  setTimeout(() => setSuccessMessage(""), 3000);
                } catch (err) {
                  console.error("Report error:", err);
                }
              }}
            >
              📊 Send Monthly Report
            </button>
          </div>
        )}
      </div>


      {editMode && (
        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>
              <input 
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Financial Settings</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={profile.currency}
                  onChange={handleChange}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="monthlyBudget">
                  Monthly Budget
                </label>
                <div className="input-with-currency">
                  <span>{profile.currency}</span>
                  <input
                    id="monthlyBudget"
                    type="number"
                    name="monthlyBudget"
                    value={profile.monthlyBudget}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="income">
                  Monthly Income
                </label>
                <div className="input-with-currency">
                  <span>{profile.currency}</span>
                  <input
                    id="income"
                    type="number"
                    name="income"
                    value={profile.income}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Add Subscription</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subName">
                  Subscription Name
                </label>
                <input 
                  id="subName"
                  name="subName" 
                  value={subscription.subName}
                  onChange={handleSubscriptionChange} 
                  placeholder="e.g., Netflix, Spotify"
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="subAmount">
                  Amount
                </label>
                <div className="input-with-currency">
                  <span>{profile.currency}</span>
                  <input 
                    id="subAmount"
                    type="number" 
                    name="subAmount"
                    value={subscription.subAmount}
                    onChange={handleSubscriptionChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subCycle">
                  Billing Cycle
                </label>
                <select 
                  id="subCycle"
                  name="subCycle"
                  value={subscription.subCycle}
                  onChange={handleSubscriptionChange}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subDate">
                Next Billing Date
              </label>
              <input 
                id="subDate"
                type="date" 
                name="subDate"
                value={subscription.subDate}
                onChange={handleSubscriptionChange}
                required 
              />
            </div>

            <button type="button" className="btn btn-outline" onClick={addSubscription}>
              + Add Subscription
            </button>
          </div>


          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={saveLoading}>
              {saveLoading ? "Saving..." : "✓ Save Changes"}
            </button>
            <button type="button" className="btn btn-cancel" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

    </main>
  );
}

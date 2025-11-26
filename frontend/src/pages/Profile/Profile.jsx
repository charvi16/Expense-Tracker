import "./Profile.css";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

export default function Profile() {
  const { refreshUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

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

        <button
          type="button"
          className="profile-save-btn"
          onClick={async () => {
            await API.post("/reports/send-now");
            alert("Monthly report email sent!");
          }}
        >
          Send Monthly Report Now
        </button>

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

          <h3>Subscriptions</h3>

          <div className="subs-block">

            <label>
              Name
              <input name="subName" value={subscription.subName}
                onChange={handleSubscriptionChange} 
                required />
            </label>

            <label>
              Amount ₹
              <input 
              type="number" 
                name="subAmount"
                value={subscription.subAmount}
                onChange={handleSubscriptionChange}
                required
              />
            </label>

            <label>
              Billing Cycle
              <select name="subCycle"
      value={subscription.subCycle}
      onChange={handleSubscriptionChange}>
                <option>monthly</option>
                <option>weekly</option>
                <option>yearly</option>
              </select>
            </label>

            <label>
              Next Billing Date
              <input type="date" name="subDate"
      value={subscription.subDate}
      onChange={handleSubscriptionChange}
      required />
            </label>

            <button type="button" className="profile-save-btn" onClick={addSubscription}>
              Add Subscription
            </button>

          </div>


          <button type="submit" className="profile-save-btn">
            Save Changes
          </button>

        </form>
      )}

    </main>
  );
}

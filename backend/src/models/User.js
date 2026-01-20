import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    currency: { type: String, default: "INR" },
    monthlyIncome: { type: Number, default: 0 },
    monthlyBudget: { type: Number, default: 0 },
    image: {
    type: String,
    default: "/default-profile.png"
    },
    settings: {
      theme: { type: String, default: "dark" },
      notifications: { type: Boolean, default: true },
      aiEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;

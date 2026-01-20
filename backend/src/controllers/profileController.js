import User from "../models/User.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};


export const updateProfile = async (req, res) => {
  const { name, currency, monthlyBudget, income } = req.body;

  req.user.name = name ?? req.user.name;
  req.user.currency = currency ?? req.user.currency;
  req.user.monthlyBudget = monthlyBudget ?? req.user.monthlyBudget;
  req.user.income = income ?? req.user.income;
  req.user.monthlyIncome = income ?? req.user.monthlyIncome;

  await req.user.save();

  res.json(req.user);
};


export const uploadPhoto = async(req, res) => {
    req.user.image = "/uploads/profile/" + req.file.filename;

  await req.user.save();

  res.json({ image: req.user.image });
};

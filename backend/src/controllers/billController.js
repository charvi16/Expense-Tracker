import Bill from "../models/Bill.js";

export const getBills = async (req, res) => {
  const bills = await Bill.find({ user: req.user._id });
  res.json(bills);
};

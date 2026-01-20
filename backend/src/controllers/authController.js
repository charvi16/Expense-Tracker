import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// ------------------- REGISTER USER -------------------
export const registerUser = async (req, res) => {
  console.log("Signup body received:", req.body); // ✅ debug frontend data

  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed in User model pre-save hook)
    const user = await User.create({ name, email, password });

    console.log("User created successfully:", user); // ✅ debug new user

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error("Registration error:", err); // ✅ detailed error
    res.status(500).json({ message: 'Registration failed' });
  }
};

// ------------------- LOGIN USER -------------------
export const loginUser = async (req, res) => {
  console.log("Login body received:", req.body); // ✅ debug frontend data

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Login failed, user not found:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await user.matchPassword(password);

    if (!match) {
      console.log("Login failed, wrong password for user:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("Login successful for user:", email);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed' });
  }
};

// ------------------- GET CURRENT USER -------------------
export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.json(req.user);
};

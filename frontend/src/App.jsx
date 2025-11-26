// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.jsx";
import React, { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import "./App.css";

const Landing = lazy(() => import("./pages/LandingPage/Landing.jsx"));
const Login = lazy(() => import("./pages/Auth/Login.jsx"));
const Signup = lazy(() => import("./pages/Auth/Signup.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard.jsx"));
const Expense = lazy(() => import("./pages/Expenses/Expense.jsx"));
const Analytics = lazy(() => import("./pages/Analytics/Analytics.jsx"));
const Calendar = lazy(() => import("./pages/Calendar/Calendar.jsx"));
const AIAdvisor = lazy(() => import("./pages/AIAdvisor/AIAdvisor.jsx"));
const Subscriptions = lazy(() => import("./pages/Susbcriptions/Subscriptions.jsx"));
const Budgets = lazy(() => import("./pages/Budgets/Budgets.jsx"));
const Reports = lazy(() => import("./pages/reports/Reports.jsx"));
const Profile = lazy(() => import("./pages/Profile/Profile.jsx"));
const Chatbot = lazy(() => import("./pages/Chatbot/Chatbot.jsx"));


export default function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Landing />} 
          />

          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />

          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" /> : <Signup />} 
          />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/expense" element={<ProtectedRoute><Expense/></ProtectedRoute>}/>
          <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>}/>
          <Route path="/calendar" element={<ProtectedRoute><Calendar/></ProtectedRoute>}/>
          <Route path="/budgets" element={<ProtectedRoute><Budgets/></ProtectedRoute>}/>
          <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions/></ProtectedRoute>}/>
          <Route path="/advisor" element={<ProtectedRoute><AIAdvisor/></ProtectedRoute>}/>
          <Route path="/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot/></ProtectedRoute>}/>


        </Routes>
      </Suspense>

      <Footer />
    </BrowserRouter>
  );
}

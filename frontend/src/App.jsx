import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import AddExpense from "./pages/AddExpense.jsx"; 
import ErrorBoundary from "./service/ErrorBoundary.jsx";
import ViewExpenses from "./pages/ViewExpenses.jsx";
import UpdateExpense from "./pages/UpdateExpense.jsx";
import { AuthProvider } from "./context/authContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Main */}
          <Route path="/home" element={<Home />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />

          {/* Expenses */}
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route
            path="/expenses"
            element={
              <ErrorBoundary>
                <ViewExpenses />
              </ErrorBoundary>
            }
          />
          <Route path="/expenses/:id/edit" element={<UpdateExpense />} />

          {/* Default */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import AddExpense from "./pages/AddExpense"; 
import ErrorBoundary from "./service/ErrorBoundary";
import ViewExpenses from "./pages/ViewExpenses";
import UpdateExpense from "./pages/UpdateExpense";
import { AuthProvider } from "./context/authContext";

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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Profile from "./pages/profile";
import UpdateProfile from "./pages/updateProfile";
import AddExpense from "./pages/addExpense"; 
import ErrorBoundary from "./service/errorboundary";
import ViewExpenses from "./pages/viewExpenses";
import UpdateExpense from "./pages/updateExpense";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/get-expenses" element={<ErrorBoundary><ViewExpenses /></ErrorBoundary>} />
          <Route path="/expenses/:id/edit" element={<UpdateExpense />} />
          <Route path="/" element={<Login />} /> {/* default route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

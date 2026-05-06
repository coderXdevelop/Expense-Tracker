import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import AddExpense from "./pages/AddExpense"; 
import ErrorBoundary from "./service/errorboundary";
import ViewExpenses from "./pages/ViewExpenses";
import UpdateExpense from "./pages/UpdateExpense";
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

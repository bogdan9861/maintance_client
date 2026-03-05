import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ProfilePage from "./pages/Profile";
import ProductScreen from "./pages/ProductScreen.jsx";
import Notifications from "./pages/Notifications.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Main />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;

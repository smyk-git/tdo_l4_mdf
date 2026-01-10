import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";    
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./ProtectedPages";

function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute> <AddPage /> </ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Home from "./pages/Homepage/Homepage";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import DashBoard from "./pages/DashBoard/DashBoard.jsx";
import ProtectedRoute from "./pages/ProtectedRoutes/ProtectedRoute.jsx";
import Groups from "./pages/DashBoard/Groups/Groups.jsx";
import CreateNewGroup from "./pages/DashBoard/CreateGroups/CreateNewGroup.jsx";
import UserProfile from "./pages/DashBoard/UserProfile/UserProfile.jsx";
import GroupDetails from "./pages/DashBoard/Groups/GroupDetails.jsx";

function App() {
  return (
    <BrowserRouter>
        <Toaster position="top-right" /> 
        <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}></Suspense>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element = {<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
          <Route path="/groups" element = {<ProtectedRoute><Groups/></ProtectedRoute>}/>
          <Route path="/creategroup" element = {<ProtectedRoute><CreateNewGroup/></ProtectedRoute>}/>
          <Route path="/userprofile" element = {<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
          <Route path="/group/:id" element={<ProtectedRoute><GroupDetails/></ProtectedRoute>} />
      

      </Routes>
    </BrowserRouter>
  );
}

export default App;
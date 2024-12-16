import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Dashboard from './Components/Faculty/Dashboard';
import SignUp from './Components/Signup';
import Login from './Components/Login';
import RequestLeave from "./Components/Faculty/RequestLeave";
import Sidebar from "./Components/Sidebar";
import Profile from "./Components/Faculty/Profile";
import { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme, Stack, styled } from "@mui/material";
import LeaveRequests from "./Components/Admin/LeaveRequests";
import ManageUsers from "./Components/Admin/ManageUsers";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import FacultyDetails from "./Components/Admin/FacultyDetails";

const AppContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: 4,
  margin: 'auto',
  backgroundColor: '#0c1017',
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 86.70%, 32.40%, 0.50), hsl(226, 30.20%, 8.40%))',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed'
    // 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}))

const Body = styled(Stack)(({ theme }) => ({
  marginLeft: '18%', // Adjust for sidebar width
  display: 'flex',
}));

function App() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  const defaultTheme = createTheme({ palette: { mode: 'dark' } });
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppContainer>
        <Router>
          <Routes>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Login />} />

            <Route path='/faculty/:facultyId/dashboard' element={<Body><Sidebar userName={userName} setUserName={setUserName} /><div style={{ flexGrow: 1 }}><Dashboard /></div></Body>} />
            <Route path='/faculty/:facultyId/requestleave' element={<Body><Sidebar userName={userName} setUserName={setUserName} /><div style={{ flexGrow: 1 }}><RequestLeave /></div></Body>} />
            <Route path="/faculty/:facultyId/profile" element={<Body><Sidebar userName={userName} setUserName={setUserName} /><div style={{ flexGrow: 1 }}><Profile /></div></Body>} />

            <Route path="/admin/dashboard" element={<Body><Sidebar userName={userName} setUserName={setUserName} /><div style={{ flexGrow: 1 }}><AdminDashboard /></div></Body>} />
            <Route path="/admin/manage-users" element={<Body><Sidebar userName={userName} setUserName={setUserName} /><div style={{ flexGrow: 1 }}><ManageUsers /></div></Body>} />
            <Route path="/admin/leave-requests/pending" element={<Body><Sidebar userName={userName} setUserName={setUserName} /><div style={{ flexGrow: 1 }}><LeaveRequests /></div></Body>} />
            <Route path="/admin/faculty/:facultyId" element={<Body><Sidebar userName={userName} setUserName={setUserName} /><div style={{ flexGrow: 1 }}><FacultyDetails /> </div></Body>} />
          </Routes>
        </Router>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;

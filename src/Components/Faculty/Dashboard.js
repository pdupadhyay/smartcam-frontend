// import * as React from 'react';

import { alpha, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@emotion/react';
import Sidebar from '../Sidebar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { facultyURL } from '../../constants';
// import AppNavbar from './components/AppNavbar';
// import Header from './components/Header';
// import MainGrid from './components/MainGrid';
// import SideMenu from './components/SideMenu';
// import AppTheme from '../shared-theme/AppTheme';
// import {
//   chartsCustomizations,
//   dataGridCustomizations,
//   datePickersCustomizations,
//   treeViewCustomizations,
// } from './theme/customizations';

// const xThemeComponents = {
//   ...chartsCustomizations,
//   ...dataGridCustomizations,
//   ...datePickersCustomizations,
//   ...treeViewCustomizations,
// };

// export default function Dashboard(props) {
//   return (
//     <AppTheme {...props} themeComponents={xThemeComponents}>
//       <CssBaseline enableColorScheme />
//       <Box sx={{ display: 'flex' }}>
//         <SideMenu />
//         <AppNavbar />
//         {/* Main content */}
//         <Box
//           component="main"
//           sx={(theme) => ({
//             flexGrow: 1,
//             backgroundColor: theme.vars
//               ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
//               : alpha(theme.palette.background.default, 1),
//             overflow: 'auto',
//           })}
//         >
//           <Stack
//             spacing={2}
//             sx={{
//               alignItems: 'center',
//               mx: 3,
//               pb: 10,
//               mt: { xs: 8, md: 0 },
//             }}
//           >
//             <Header />
//             <MainGrid />
//           </Stack>
//         </Box>
//       </Box>
//     </AppTheme>
//   );
// }

const Dashboard = () => {
    const defaultTheme = createTheme({ palette: { mode: 'dark' } });
    const { facultyId } = useParams();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [error, setError] = useState('');

    const fetchAttendanceRecords = async (facultyId) => {
        try {
            const response = await fetch(`${facultyURL}/2/attendance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch attendance records');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching attendance records:', error);
            return null;
        }
    };

    useEffect(() => {
        document.title = "Dashboard";
        const getAttendanceRecords = async () => {
            const data = await fetchAttendanceRecords(facultyId);
            if (data) {
                setAttendanceRecords(data);
            } else {
                setError('Failed to fetch attendance records');
            }
        };
        getAttendanceRecords();
    }, [facultyId]);

    return (
        <div>
            <h1>Attendance Records</h1>
            {error && <p>{error}</p>}
            {attendanceRecords.length > 0 ? (
                <ul>
                    {attendanceRecords.map((record, index) => (
                        <li key={index}>
                            {/* Render the attendance record details */}
                            {record.date}: {record.status}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No attendance records found.</p>
            )}
        </div>
    );
}

export default Dashboard;
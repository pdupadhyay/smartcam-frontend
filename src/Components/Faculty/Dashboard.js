import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid2, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { facultyURL } from '../../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

const getDateRange = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return {
        startDate: firstDayOfMonth.toISOString().split('T')[0],
        endDate: todayDate.toISOString().split('T')[0],
    };
};

const AttendanceDashboard = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [workingDays, setWorkingDays] = useState(0);
    const [presentDays, setPresentDays] = useState(0);
    const [leaves, setLeaves] = useState(0);
    const [error, setError] = useState(null);

    const fetchAttendanceRecords = async (facultyId, startDate, endDate) => {
        try {
            const response = await fetch(`${facultyURL}/${facultyId}/attendanceAndLeave`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
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
            const facultyId = localStorage.getItem('id');
            const { startDate, endDate } = getDateRange();

            const data = await fetchAttendanceRecords(facultyId, startDate, endDate);
            if (data) {
                // Filter records for the current month
                const currentMonthRecords = data.attendanceRecords.filter((item) => {
                    const recordDate = new Date(item.attendanceDate);
                    const today = new Date();
                    return (
                        recordDate.getFullYear() === today.getFullYear() &&
                        recordDate.getMonth() === today.getMonth()
                    );
                });
                setAttendanceRecords(data.attendanceRecords);
                setLeaves(data.leaveDetails);
                const workingDaysCount = getWorkingDays(startDate, endDate);
                const presentCount = currentMonthRecords.filter(
                    (item) => item.facultyStatus === "P"
                ).length;

                setWorkingDays(workingDaysCount);
                setPresentDays(presentCount);
            } else {
                setError('Failed to fetch attendance records');
            }
        };

        getAttendanceRecords();
    }, []);

    const getWorkingDays = (startDate, endDate) => {
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        let workingDaysCount = 0;

        while (currentDate <= end) {
            const day = currentDate.getDay();
            if (day !== 0 && day !== 6) {
                workingDaysCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return workingDaysCount;
    };

    // Pie chart data
    const absentDays = workingDays - presentDays;
    const chartData = {
        labels: ['Present Days', 'Absent Days'],
        datasets: [
            {
                label: 'Attendance Distribution',
                data: [presentDays, absentDays > 0 ? absentDays : 0],
                backgroundColor: ['#4caf50', '#f44336'],
                hoverBackgroundColor: ['#388e3c', '#d32f2f'],
            },
        ],
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3, color: 'white', textAlign: 'center' }}>
                Faculty Attendance Dashboard
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Grid2 container spacing={3} justifyContent='center'>
                {/* Summary Cards */}
                <Grid2 item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Working Days</Typography>
                            <Typography variant="h4">{workingDays}</Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Days Present</Typography>
                            <Typography variant="h4">{presentDays}</Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Attendance Percentage</Typography>
                            <Typography variant="h4">
                                {workingDays > 0 ? ((presentDays / workingDays) * 100).toFixed(2) : "0.00"}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>

            {/* Pie Chart */}
            <Grid2 container spacing={3} sx={{ my: 3, justifyContent: 'center' }}>
                <Grid2 item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>Attendance Overview</Typography>
                    <Pie data={chartData} />
                </Grid2>
            </Grid2>

            {/* Attendance Table */}
            <TableContainer component={Paper} sx={{ my: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceRecords.length ? attendanceRecords.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.attendanceDate}</TableCell>
                                <TableCell>{item.attendanceTime}</TableCell>
                                <TableCell>{item.facultyStatus === "P" ? "Present" : "Absent"}</TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={3} align='center'>No records found</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Leave Table */}
            <TableContainer component={Paper} sx={{ my: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Leave Reason</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaves.length ? leaves.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.fromDate}</TableCell>
                                <TableCell>{item.toDate}</TableCell>
                                <TableCell>{item.leaveReason}</TableCell>
                                <TableCell>{item.status}</TableCell>
                            </TableRow>
                        )) :
                            <TableRow><TableCell colSpan={4} align='center'>No records found</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AttendanceDashboard;

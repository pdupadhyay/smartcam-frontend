import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminURL } from "../../constants";
import { Container, Typography, CircularProgress, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Divider, Chip, TableFooter, TablePagination, IconButton } from "@mui/material";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FacultyDetails = () => {
    const [faculty, setFaculty] = useState({});
    const [attendanceData, setAttendanceData] = useState([]);
    const [leaveData, setLeaveData] = useState([]);
    const [error, setError] = useState(null);
    const { facultyId } = useParams();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [attendancePage, setAttendancePage] = useState(0);
    const [attendanceRowsPerPage, setAttendanceRowsPerPage] = useState(5);
    const [leavePage, setLeavePage] = useState(0);
    const [leaveRowsPerPage, setLeaveRowsPerPage] = useState(5);

    const fetchFaculty = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${adminURL}/${facultyId}/attendanceAndLeave`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            console.log(data);
            document.title = 'Faculty Details';
            setAttendanceData(data.attendanceRecords);
            setLeaveData(data.leaveDetails);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFaculty();
    }, []);

    const handleChangeAttendancePage = (event, newPage) => {
        setAttendancePage(newPage);
    };

    const handleChangeAttendanceRowsPerPage = (event) => {
        setAttendanceRowsPerPage(parseInt(event.target.value, 10));
        setAttendancePage(0);
    };

    const handleChangeLeavePage = (event, newPage) => {
        setLeavePage(newPage);
    };

    const handleChangeLeaveRowsPerPage = (event) => {
        setLeaveRowsPerPage(parseInt(event.target.value, 10));
        setLeavePage(0);
    };

    const handleDeleteUser = async () => {
        const response = await fetch(`${adminURL}/faculty/${facultyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        setMessage('Faculty member deleted successfully');
        setOpen(true);
    };

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

    const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'));

    const monthlyAttendance = attendanceData?.reduce((acc, record) => {
        const month = dayjs(record.attendanceDate).month();
        const workingDays = getWorkingDays(dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD'));
        if (!acc[month]) {
            acc[month] = { present: 0, absent: workingDays, onLeave: 0 };
        }
        if (record.facultyStatus === 'P') {
            acc[month].present += 1;
        } else if (record.facultyStatus === 'L') {
            acc[month].onLeave += 1;
        }
        acc[month].absent = workingDays - acc[month].present - acc[month].onLeave;
        return acc;
    }, Array.from({ length: 12 }, () => ({ present: 0, absent: 0, onLeave: 0 })));

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Present',
                data: monthlyAttendance.map(month => month.present),
                backgroundColor: '#4caf50',
            },
            {
                label: 'Absent',
                data: monthlyAttendance.map(month => month.absent),
                backgroundColor: '#f44336',
            },
            {
                label: 'On Leave',
                data: monthlyAttendance.map(month => month.onLeave),
                backgroundColor: '#ff9800',
            },
        ],
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">Error: {error.message}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt='2vh'>
                <Typography variant="h4" gutterBottom>
                    Faculty Details
                </Typography>
                <Button color="error" variant="contained" onClick={() => { setOpen(true); setMessage('Are you sure you want to delete this faculty member?') }}>
                    Delete Faculty
                </Button>
            </Box>
            <Box sx={{ my: 2 }}>
                <Divider sx={{ my: 2 }}>
                    <Chip label="Monthly Attendance Chart" size="medium" />
                </Divider>
                <Bar data={chartData} />
            </Box>

            {/* Leave Table */}
            <Box sx={{ my: 2 }}>
                <Divider sx={{ my: 2 }}>
                    <Chip label="Leave Details" size="medium" />
                </Divider>
                <Table component={Paper}>
                    <TableHead>
                        <TableRow>
                            <TableCell>From Date</TableCell>
                            <TableCell>To Date</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaveData?.map((leave, index) => (
                            <TableRow key={index}>
                                <TableCell>{leave.fromDate}</TableCell>
                                <TableCell>{leave.toDate}</TableCell>
                                <TableCell>{leave.leaveReason}</TableCell>
                                <TableCell>{leave.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[leaveRowsPerPage, 2 * leaveRowsPerPage, 5 * leaveRowsPerPage, { label: 'All', value: -1 }]}
                                colSpan={4}
                                count={leaveData.length}
                                rowsPerPage={leaveRowsPerPage}
                                page={leavePage}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                        sx: {
                                            '& option': {
                                                textAlign: 'center', // Center-align the text in options
                                            },
                                        }
                                    },
                                }}
                                onPageChange={handleChangeLeavePage}
                                onRowsPerPageChange={handleChangeLeaveRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                                sx={{ textAlign: 'center' }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </Box>

            {/* Attendance Table */}
            <Box sx={{ my: 2 }}>
                <Divider sx={{ my: 2 }}>
                    <Chip label="Attendance History" size="medium" />
                </Divider>
                <Table component={Paper}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceData.length > 0 ? (attendanceRowsPerPage > 0
                            ? attendanceData.slice(attendancePage * attendanceRowsPerPage, attendancePage * attendanceRowsPerPage + attendanceRowsPerPage)
                            : attendanceData
                        ).map((record, index) => (
                            <TableRow key={index}>
                                <TableCell>{record.attendanceDate}</TableCell>
                                <TableCell>{record.facultyStatus === 'P' ? 'Present' : 'Leave'}</TableCell>
                            </TableRow>
                        )) :
                            (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        No Attendance Data.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[attendanceRowsPerPage, 2 * attendanceRowsPerPage, 5 * attendanceRowsPerPage, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={attendanceData.length}
                                rowsPerPage={attendanceRowsPerPage}
                                page={attendancePage}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                        sx: {
                                            'option': {
                                                textAlign: 'center', // Center-align the text in options
                                            },
                                        }
                                    },
                                }}
                                onPageChange={handleChangeAttendancePage}
                                onRowsPerPageChange={handleChangeAttendanceRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </Box>

            {/* Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {message === 'Are you sure you want to delete this faculty member?' ?
                        <>
                            <Button onClick={() => setOpen(false)}>No</Button>
                            <Button onClick={handleDeleteUser}>
                                Yes
                            </Button>
                        </> :
                        <Button onClick={() => navigate('/admin/manage-users')}>Done</Button>}
                </DialogActions>
            </Dialog>
        </Container >
    );
}

export default FacultyDetails;
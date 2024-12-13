import React, { useState, useEffect } from 'react';
import { adminURL } from '../../constants';
import { Container, Typography, TableContainer, Table, TableBody, Paper, TableRow, TableCell, TableFooter, TablePagination, Button, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Backdrop, CircularProgress } from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

const LeaveRequests = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        const response = await fetch(`${adminURL}/leave/pending`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        setLeaveRequests(data);
        setLoading(false);
    }

    useEffect(() => {
        document.title = 'Leave Requests';
        fetchNotifications();
    }, []);

    const handleApprove = async (leaveId) => {
        setLoading(true);
        const response = await fetch(`${adminURL}/leave/${leaveId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status: 'Approved' })
        });
        const data = await response.json();
        setMessage(data.message);
        setOpen(true);
        fetchNotifications();
        setLoading(false);
    }
    const handleReject = async (leaveId) => {
        setLoading(true);
        const response = await fetch(`${adminURL}/leave/${leaveId}`, {

            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status: 'Denied' })
        });
        const data = await response.json();
        setMessage(data.message);
        setOpen(true);
        fetchNotifications();
        setLoading(false);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth='full' sx={{ my: 4, textAlign: 'center' }}>
            <Typography component="h1" variant="h4" color='white' padding={3}>
                Leave Requests
            </Typography>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Faculty ID</TableCell>
                            <TableCell align="right">From Date</TableCell>
                            <TableCell align="right">To Date</TableCell>
                            <TableCell align="right">Leave Reason</TableCell>
                            <TableCell align="right">Applied At</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaveRequests.length > 0 ? (rowsPerPage > 0
                            ? leaveRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : leaveRequests
                        ).map((row) => (
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row">
                                    {row.faculty.name}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.fromDate}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.toDate}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.leaveReason}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {new Date(row.appliedAt).toDateString()}
                                </TableCell>
                                <TableCell style={{ width: 300 }} align="right">
                                    <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={() => handleApprove(row._id)}>
                                        Approve
                                    </Button>

                                    <Button variant="contained" color="error" onClick={() => handleReject(row._id)}>
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) :
                            (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        No New Leave Requests.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
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
                    <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default LeaveRequests;
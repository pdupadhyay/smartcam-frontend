import React, { useState, useEffect } from 'react';
import { adminURL } from '../../constants';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, Backdrop, Button, Card, CardContent, CardHeader, CardMedia, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${adminURL}/faculty`,
                {
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
            setUsers(data);
            setLoading(false);
        }
        catch (error) {
            setError(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        document.title = 'Manage Users';
        fetchUsers();
    }, []);

    const handleDeleteUser = (user) => {
        alert('Delete user');

        setOpen(false);
        fetchUsers();
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    if (error) {
        return (
            <Stack width='100%' paddingTop='2vh'>
                <Alert variant="outlined" severity="error">
                    {error.message}
                </Alert>
            </Stack>)
    }

    return (
        <Container sx={{ marginY: '2vh' }}>
            <Typography paddingY='2vh' textAlign='center' variant="h4" color='white'>Manage Users</Typography>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {users.map((user) => (
                <Accordion key={user.fid} expanded={expanded === user.fid} onChange={handleChange(user.fid)}>
                    <AccordionSummary
                        aria-controls={`panel${user.fid}a-content`}
                        id={`panel${user.fid}a-header`}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>{user.name}</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{user.email}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Card sx={{ display: 'flex' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.dob}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {user.gender}
                                </Typography>
                            </CardContent>
                            <CardMedia
                                component="img"
                                sx={{ width: 151 }}
                                image={user.profilePicturePath}
                                alt={user.name}
                            />
                        </Card>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button size="small" onClick={() => { setOpen(true); setMessage(`Are you sure you want to delete ${user.name}?`) }}>Delete</Button>
                    </AccordionActions>
                </Accordion>
            ))}

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
                    <Button onClick={() => setOpen(false)}>No</Button>
                    <Button onClick={handleDeleteUser} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ManageUsers;
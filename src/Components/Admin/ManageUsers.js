import React, { useState, useEffect } from 'react';
import { adminURL } from '../../constants';
import { Alert, Backdrop, CircularProgress, Container, Divider, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

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


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <TextField
                fullWidth
                label="Search Faculty"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ marginBottom: '2vh' }}
            />
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {filteredUsers.map((item) => (
                    <ListItem key={item.fid} alignItems="flex-start" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/faculty/${item.fid}`)}>
                        <ListItemText
                            primary={item.name}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{ color: 'text.primary', display: 'inline' }}
                                    >{item.email}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                        <Divider variant="inset" component="li" />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default ManageUsers;
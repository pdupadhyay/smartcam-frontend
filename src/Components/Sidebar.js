import styled from "@emotion/styled";
import { List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import logo from './../Content/Logo.png';
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../constants";

const SidebarContainer = styled(Stack)(({ theme }) => ({
    width: '18%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    left: 0,
    top: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c1017',
    borderRight: '1px solid #2d3748',
}));

const Sidebar = ({ userName, setUserName, children }) => {
    const [currentTab, setCurrentTab] = useState('Home');
    const navigate = useNavigate();
    const facultyId = localStorage.getItem('id');
    const location = useLocation();

    const handleClick = (tabText, url) => {
        if (tabText === "Logout") {
            fetch(`${baseURL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
                .then(response => {
                    if (response.status === 200) {
                        setUserName(null)
                        localStorage.clear()
                        tabText = 'Home'
                    }
                    else throw new Error('Something went wrong');

                })
        }
        setCurrentTab(tabText);
        navigate(url ? `/${url}` : '/');
    }

    const sidebarListItem = useMemo(() => {
        let items = [{ text: 'Login', url: 'login' }];
        if (localStorage.getItem('role') === 'faculty') {
            items = [
                { text: 'Home', url: `faculty/${facultyId}/dashboard` },
                { text: 'Request Leave', url: `faculty/${facultyId}/requestleave` },
                { text: 'Profile', url: `faculty/${facultyId}/profile` },
                { text: `Logout`, url: `` }
            ];
        } else if (localStorage.getItem('role') === 'admin') {
            items = [
                { text: 'Home', url: `admin/dashboard` },
                { text: 'Manage Faculty', url: 'admin/manage-users' },
                { text: 'Leave Requests', url: 'admin/leave-requests/pending' },
                { text: `Logout`, url: '' }
            ];
        }
        return items;
    }, [facultyId]);


    useEffect(() => {
        const currentPath = location.pathname.split('/').slice(1).join('/');
        const matchedItem = sidebarListItem.find(item => item.url === currentPath);
        if (matchedItem) {
            setCurrentTab(matchedItem.text);
        }
    }, [location, sidebarListItem]);

    return (
        <div style={{ display: 'flex' }}>
            <SidebarContainer direction="column" justifyContent="center" textAlign="center">
                <img src={logo} alt="Logo" style={{ marginTop: '2vh', height: '15vh', width: '10vw', cursor: 'pointer' }} onClick={() => navigate('/')}></img>
                {userName ? (<Typography component='h4' variant="h1" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'white' }}>Hi, {userName}</Typography>)
                    : ''}
                <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'center', color: 'white' }}>
                    <List >
                        {sidebarListItem.map((item, index) => (
                            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton selected={currentTab === item.text} onClick={() => handleClick(item.text, item.url)}>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </SidebarContainer>
            {children}
        </div>
    )
}

export default Sidebar;
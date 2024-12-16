import { FormControl, Typography, Box, FormLabel, TextField, RadioGroup, FormControlLabel, Radio, Button, createTheme, ThemeProvider, styled, Stack, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import MuiCard from '@mui/material/Card';
import { facultyURL } from "../../constants";

const ProfileContainer = styled(Stack)(({ theme }) => ({
    height: '100%',
    padding: 4,
    margin: 'auto',
}))

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const Popup = ({ open, message, onClose }) => (
    <Modal open={open} onClose={onClose}>
        <Box sx={{
            fontFamily: 'cursive', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400,
            bgcolor: 'background.paper', boxShadow: 24, p: 2, textAlign: 'center'
        }}>
            <p>{message}</p>
            <Button onClick={onClose} >Close</Button>
        </Box>
    </Modal>
);


const PasswordChangePopup = ({ open, onClose, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        onSubmit(password);
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4,
            }}>
                <Typography variant="h6" component="h2">
                    Change Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: '2vh' }}>
                        Change Password
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

const Profile = () => {
    const [user, setUser] = useState(
        {
            name: '',
            email: '',
            password: '',
            fid: '',
            gender: '',
            dob: '',
            phoneNumber: ''
        }
    )
    const defaultTheme = createTheme({ palette: { mode: 'dark' } });
    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [passwordPopupOpen, setPasswordPopupOpen] = useState(false);

    useEffect(() => {
        fetch(`${facultyURL}/profile`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                const filteredData = {
                    name: data.name,
                    email: data.email,
                    fid: data.fid,
                    gender: data.gender,
                    dob: data.dob,
                    phoneNumber: data.phone,
                    password: data.password
                }
                setUser(filteredData);
            })
    }, [setUser])

    const handleChange = (e) => {
        setUser({ ...user, [e.target.id]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${facultyURL}/profile`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    phone: user.phoneNumber,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Profile updated successfully") {
                    setPopupMessage(data.message);
                } else {
                    setPopupMessage('Failed to update profile. Please try again.');
                }
            })
            .catch(error => {
                console.log('Error:', error);
                setPopupMessage('An error occurred. Please try again later.');
            });
    }

    const handlePasswordChange = async (newPassword) => {
        const response = await fetch(`${facultyURL}/changePassword`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    newPassword: newPassword,
                })
            })
        if (response.status === 200) {
            setPopupMessage('Password changed successfully');
        } else {
            setPopupMessage('Failed to update password. Please try again.');
        }
        setPasswordPopupOpen(false);
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <ProfileContainer direction="column" justifyContent="space-between">
                <Stack sx={{ justifyContent: 'center', height: '100%', p: 2, }}>
                    <Card variant="outlined">
                        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'white' }}>
                            Profile
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, color: 'inherit' }} >
                            <FormControl >
                                <FormLabel htmlFor="name" sx={{ color: 'white' }}>Full name</FormLabel>
                                <TextField autoComplete="name" name="name" required fullWidth id="name" placeholder="Full Name" value={user.name} slotProps={{ input: { readOnly: true } }} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="email" sx={{ color: 'white' }}>Email</FormLabel>
                                <TextField fullWidth id="email" name="email" autoComplete="email" variant="outlined" value={user.email} slotProps={{ input: { readOnly: true } }} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="fid" sx={{ color: 'white' }}>Faculty ID</FormLabel>
                                <TextField autoComplete="fid" name="fid" required fullWidth id="fid" placeholder="Faculty ID/UID" value={user.fid} slotProps={{ input: { readOnly: true } }} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="gender">Gender</FormLabel>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="gender" id='gender' value={user.gender} slotProps={{ input: { readOnly: true } }}>
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="dob" sx={{ color: 'white' }}>Date of Birth</FormLabel>
                                <TextField type="date" autoComplete="dob" name="dob" required fullWidth id="dob" placeholder="Date of Birth" value={user.dob} slotProps={{ input: { readOnly: true } }} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="phoneNumber" sx={{ color: 'white' }}>Phone Number</FormLabel>
                                <TextField autoComplete="phoneNumber" name="phoneNumber" required fullWidth id="phoneNumber" placeholder="+1 2345678900" value={user.phoneNumber}
                                    error={phoneError} helperText={phoneErrorMessage} color={phoneError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                        </Box>
                        <Button type="submit" sx={{ marginTop: '2vh' }} fullWidth variant="contained" onClick={handleSubmit}>
                            Update Profile
                        </Button>
                        <Button sx={{ marginTop: '2vh' }} fullWidth variant="outlined" onClick={() => setPasswordPopupOpen(true)}>
                            Change Password
                        </Button>
                    </Card>
                </Stack>
            </ProfileContainer>
            <PasswordChangePopup
                open={passwordPopupOpen}
                onClose={() => setPasswordPopupOpen(false)}
                onSubmit={handlePasswordChange}
            />
            <Popup open={popupMessage !== ''} message={popupMessage} onClose={() => setPopupMessage('')} />
        </ThemeProvider>
    )
}

export default Profile;
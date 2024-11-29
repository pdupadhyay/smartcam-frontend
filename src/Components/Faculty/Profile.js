import { FormControl, Typography, Box, FormLabel, TextField, RadioGroup, FormControlLabel, Radio, Button, Divider, Link, createTheme, ThemeProvider, styled, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import MuiCard from '@mui/material/Card';
import { facultyURL } from "../../constants";

const ProfileContainer = styled(Stack)(({ theme }) => ({
    height: '100%',
    padding: 4,
    margin: 'auto',
    backgroundColor: '#0c1017',
    backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
        backgroundImage:
            'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
        // 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
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

const Popup = ({ message, onClose }) => (
    <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: 'black',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)', zIndex: 1000, textAlign: 'center', color: 'white', fontFamily: 'cursive'
    }}>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
    </div>
);

const Profile = () => {
    const [user, setUser] = useState(
        {
            name: '',
            email: '',
            password: '',
            fid: '',
            gender: '',
            dob: '',
            phoneNumber: '',
            image: null
        }
    )
    const defaultTheme = createTheme({ palette: { mode: 'dark' } });
    const [image, setImage] = useState(null)
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [fidError, setFidError] = useState(false);
    const [fidErrorMessage, setFidErrorMessage] = useState('');
    const [dobError, setDobError] = useState(false);
    const [dobErrorMessage, setDobErrorMessage] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
    const [genderError, setGenderError] = useState(false);
    const [genderErrorMessage, setGenderErrorMessage] = useState('');
    const [imageError, setImageError] = useState(false);
    const [imageErrorMessage, setImageErrorMessage] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

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
                    password: data.password,
                    image: data.profilePicturePath
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
                    email: user.email,
                    phone: user.phoneNumber,
                    dob: user.dob,
                    gender: user.gender
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Profile updated successfully") {
                    setPopupMessage('Profile updated successfully.');
                } else {
                    setPopupMessage('Failed to update profile. Please try again.');
                }
            })
            .catch(error => {
                console.log('Error:', error);
                setPopupMessage('An error occurred. Please try again later.');
            });
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <ProfileContainer direction="column" justifyContent="space-between">
                {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage('')} />}
                <Stack sx={{ justifyContent: 'center', height: '100%', p: 2, }}>
                    <Card variant="outlined">
                        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'white' }}>
                            Profile
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, color: 'inherit' }} >
                            <FormControl >
                                <FormLabel htmlFor="name" sx={{ color: 'white' }}>Full name</FormLabel>
                                <TextField autoComplete="name" name="name" required fullWidth id="name" placeholder="Full Name" value={user.name}
                                    error={nameError} helperText={nameErrorMessage} color={nameError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="email" sx={{ color: 'white' }}>Email</FormLabel>
                                <TextField fullWidth id="email" name="email" autoComplete="email" variant="outlined" value={user.email} slotProps={{ input: { readOnly: true } }} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="fid" sx={{ color: 'white' }}>Faculty ID</FormLabel>
                                <TextField autoComplete="fid" name="fid" required fullWidth id="fid" placeholder="Faculty ID/UID" value={user.fid}
                                    error={fidError} helperText={fidErrorMessage} color={fidError ? 'error' : 'primary'} onChange={handleChange} slotProps={{ input: { readOnly: true } }} />
                            </FormControl>
                            <FormControl error={genderError}>
                                <FormLabel htmlFor="gender">Gender</FormLabel>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="gender" id='gender' value={user.gender} onChange={handleChange}>
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                                {genderError && <Typography color="error">{genderErrorMessage}</Typography>}
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="dob" sx={{ color: 'white' }}>Date of Birth</FormLabel>
                                <TextField type="date" autoComplete="dob" name="dob" required fullWidth id="dob" placeholder="Date of Birth" value={user.dob}
                                    error={dobError} helperText={dobErrorMessage} color={dobError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="phoneNumber" sx={{ color: 'white' }}>Phone Number</FormLabel>
                                <TextField autoComplete="phoneNumber" name="phoneNumber" required fullWidth id="phoneNumber" placeholder="+1 2345678900" value={user.phoneNumber}
                                    error={phoneError} helperText={phoneErrorMessage} color={phoneError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                        </Box>
                        <Button type="submit" fullWidth variant="contained" onClick={handleSubmit}>
                            Update Profile
                        </Button>
                    </Card>
                </Stack>
                {/* <FormLabel htmlFor='image' sx={{ color: 'white' }}>Upload your image</FormLabel>
                        <input type='file' id='image' name='image' accept='image/*' onChange={handleChange} />
                    </FormControl> */}
            </ProfileContainer>
        </ThemeProvider>
    )
}

export default Profile;
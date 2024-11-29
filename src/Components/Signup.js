import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import bgimage from './../Content/BG.png'
import { facultyURL } from '../constants';

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: '100%',
    padding: 4,
    backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
        backgroundImage:
            `url(${bgimage})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
        // 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
}));

export default function SignUp() {
    const defaultTheme = createTheme({ palette: { mode: 'dark' } });
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [fidError, setFidError] = React.useState(false);
    const [fidErrorMessage, setFidErrorMessage] = React.useState('');
    const [genderError, setGenderError] = React.useState(false);
    const [genderErrorMessage, setGenderErrorMessage] = React.useState('');
    const [dobError, setDobError] = React.useState(false);
    const [dobErrorMessage, setDobErrorMessage] = React.useState('');
    const [phoneError, setPhoneError] = React.useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
    const [user, setUser] = React.useState({
        name: '',
        email: '',
        password: '',
        fid: '',
        gender: '',
        dob: '',
        phoneNumber: '',
        image: null
    })
    document.title = 'SmartCam - Sign up';

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value })
    }

    const validateInputs = () => {
        const email = user.email;
        const password = user.password;
        const name = user.name;
        const fid = user.fid;
        const gender = user.gender;
        const dob = user.dob;
        const phone = user.phoneNumber

        let isValid = false;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        if (!fid.value || fid.value.length < 1) {
            setFidError(true);
            setFidErrorMessage('Faculty ID is required.');
            isValid = false;
        }
        else {
            setFidError(false);
            setFidErrorMessage('');
        }
        if (!gender.value || gender.value.length < 1) {
            setGenderError(true);
            setGenderErrorMessage
                ('Gender is required.');
            isValid = false;
        }
        else {
            setGenderError(false);
            setGenderErrorMessage('');
        }
        if (!dob.value || dob.value.length < 1) {
            setDobError(true);
            setDobErrorMessage('Date of Birth is required.');
            isValid = false;
        }
        else {
            setDobError(false);
            setDobErrorMessage('');
        }
        if (!phone.value || phone.value.length < 1) {
            setPhoneError(true);
            setPhoneErrorMessage('Phone Number is required.');
            isValid = false;
        }
        else {
            setPhoneError(false);
            setPhoneErrorMessage('');
        }


        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const imageInput = document.getElementById('image');
        const imageFile = imageInput.files[0];

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('fid', user.fid);
        formData.append('gender', user.gender);
        formData.append('dob', user.dob);
        formData.append('phone', user.phoneNumber);
        formData.append('image', imageFile);

        if (validateInputs()) {
            fetch(`${facultyURL}/register`,
                {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    if (data.status === 201) {
                        console.log('Logged in successfully');
                        window.location.href = '/';
                    } else {
                        console.log('Login failed');
                    }
                })
                .catch(error => console.log('Error:', error)
                )
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline enableColorScheme />
            <SignUpContainer direction="column" justifyContent="space-between">
                <Stack sx={{ justifyContent: 'center', height: '100%', p: 2 }}>
                    <Card variant="outlined">
                        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                            Sign up
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} >
                            <FormControl>
                                <FormLabel htmlFor="name">Full name</FormLabel>
                                <TextField autoComplete="name" name="name" required fullWidth id="name" placeholder="Full Name"
                                    error={nameError} helperText={nameErrorMessage} color={nameError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField required fullWidth id="email" placeholder="your@email.com" name="email" autoComplete="email" variant="outlined" error={emailError}
                                    helperText={emailErrorMessage} color={passwordError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <TextField required fullWidth name="password" placeholder="••••••" type="password" id="password" autoComplete="new-password" variant="outlined"
                                    error={passwordError} helperText={passwordErrorMessage} color={passwordError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="fid">Faculty ID</FormLabel>
                                <TextField autoComplete="fid" name="fid" required fullWidth id="fid" placeholder="Faculty ID/UID"
                                    error={fidError} helperText={fidErrorMessage} color={fidError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                            <FormControl error={genderError}>
                                <FormLabel htmlFor="gender">Gender</FormLabel>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="gender" id='gender' onChange={handleChange}>
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                                {genderError && <Typography color="error">{genderErrorMessage}</Typography>}
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                                <TextField type="date" autoComplete="dob" name="dob" required fullWidth id="dob" placeholder="Date of Birth"
                                    error={dobError} helperText={dobErrorMessage} color={dobError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                                <TextField autoComplete="phoneNumber" name="phoneNumber" required fullWidth id="phoneNumber" placeholder="+1 2345678900"
                                    error={phoneError} helperText={phoneErrorMessage} color={phoneError ? 'error' : 'primary'} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor='image'>Upload your image</FormLabel>
                                <input type='file' id='image' name='image' accept='image/*' onChange={handleChange} />
                            </FormControl>
                            <Button type="submit" fullWidth variant="contained" onClick={handleSubmit}>
                                Sign up
                            </Button>
                            <Divider>
                                <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                            </Divider>
                            <Typography sx={{ textAlign: 'center' }}>
                                Already have an account?{' '}
                                <span>
                                    <Link href="/" variant="body2" sx={{ alignSelf: 'center' }} >
                                        Sign in
                                    </Link>
                                </span>
                            </Typography>
                        </Box>

                    </Card>
                </Stack>
            </SignUpContainer>
        </ThemeProvider>
    );
}
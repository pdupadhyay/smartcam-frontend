import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { facultyURL } from "../../constants";

const RequestLeave = () => {
    const [leaveData, setLeaveData] = useState({
        fromDate: '',
        toDate: '',
        leaveReason: ''
    });
    const [errors, setErrors] = useState({
        fromDate: false,
        toDate: false,
        leaveReason: false
    });
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        setLeaveData({ ...leaveData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            fromDate: leaveData.fromDate === '',
            toDate: leaveData.toDate === '',
            leaveReason: leaveData.leaveReason === ''
        }
        setErrors(newErrors);
        if (newErrors.fromDate || newErrors.toDate || newErrors.leaveReason) {
            return;
        }

        const response = await fetch(`${facultyURL}/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(leaveData)
        });
        if (response.ok) {
            setOpen(true);
            return;
        }
    }

    return (
        <Container maxWidth="lg" sx={{ m: 2 }}>
            <Typography component="h1" variant="h4" textAlign={"center"}>
                Request Leave
            </Typography>
            <form onSubmit={handleSubmit} style={{ padding: '2%' }}>
                <TextField
                    id="fromDate"
                    label="From"
                    type="date"
                    sx={{ mt: 2, mr: 8, mb: 4, width: '40%' }}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={errors.fromDate}
                    helperText={errors.fromDate ? 'From date is required' : ''}
                />
                <TextField
                    id="toDate"
                    label="To"
                    type="date"
                    sx={{ mt: 2, mb: 4, width: '40%' }}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={errors.toDate}
                    helperText={errors.toDate ? 'To date is required' : ''}
                />
                <TextField
                    id="leaveReason"
                    label="Reason"
                    multiline
                    rows={4}
                    fullWidth
                    sx={{ mt: 2 }}
                    onChange={handleChange}
                    error={errors.leaveReason}
                    helperText={errors.leaveReason ? 'Reason is required' : ''}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} >Submit</Button>
            </form>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Leave Request Submitted"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your leave request has been submitted from {leaveData.fromDate} to {leaveData.toDate}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default RequestLeave;
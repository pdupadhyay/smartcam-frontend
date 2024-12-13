import { useEffect, useState } from "react";
import { adminURL } from "../../constants";
import { Button, Chip, Container, Divider, Grid2 } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [presentFaculties, setPresentFaculties] = useState(0);
    const [absentFaculties, setAbsentFaculties] = useState(0);
    const [onLeaveFaculties, setOnLeaveFaculties] = useState(0);
    const [pendingLeaves, setPendingLeaves] = useState(0);
    const navigate = useNavigate();

    const allAttendance = async () => {
        const response = await fetch(`${adminURL}/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        const data = await response.json();
        setPresentFaculties(data.present);
        setAbsentFaculties(data.absent);
        setOnLeaveFaculties(data.onLeave);
        setPendingLeaves(data.pendingLeaves);
    }
    useEffect(() => {
        allAttendance();
    })

    //Pie Chart data
    const chartData = {
        labels: ['Present', 'Absent', 'On Leave'],
        datasets: [
            {
                label: "Today's Attendance",
                data: [presentFaculties, absentFaculties, onLeaveFaculties],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }
        ]
    }

    return (
        <Container sx={{ textAlign: 'center', my: 2}}>
            <h1>Dashboard</h1>
            <Divider>
                <Chip label="Today's Attendance" size="small" />
            </Divider>
            <Grid2 container spacing={3} justifyContent="center" mt='3vh' mb='5vh'>
                <Grid2 item xs={12} sm={6}>
                    <div style={{ height: '400px', width: '400px', margin: '0 auto' }}>
                        <Pie data={chartData} />
                    </div>
                </Grid2>
                <Grid2 container direction={"column"} spacing={3} justifyContent="center">
                    <Grid2 item xs={2} sm={4}>
                        <h3>Present Faculties: {presentFaculties}</h3>
                    </Grid2>

                    <Grid2 item xs={12} sm={4}>
                        <h3>Absent Faculties: {absentFaculties}</h3>
                    </Grid2>

                    <Grid2 item xs={12} sm={4}>
                        <h3>Faculties on Leave: {onLeaveFaculties}</h3>
                    </Grid2>
                </Grid2>
            </Grid2>

            <Divider>
                <Chip label="Pending Leaves" size="small" />
            </Divider>
            <h3>You have {pendingLeaves} leave request pending for approval</h3>
            <Button variant="contained" color="primary" onClick={() => navigate('/admin/leave-requests/pending')}>
                View Pending Leaves
            </Button>
        </Container>
    );
}

export default AdminDashboard;
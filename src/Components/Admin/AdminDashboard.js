import { useEffect } from "react";
import { adminURL } from "../../constants";

const AdminDashboard = () => {

    const allAttendance = async () => {
        const response = await fetch(`${adminURL}/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        const data = await response.json();
        console.log(data);
    }
    useEffect(() => {
        allAttendance();
    })


    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    );
}

export default AdminDashboard;
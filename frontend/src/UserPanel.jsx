// src/UserPanel.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
} from "@mui/material";
import api from "./apiInstance";

const UserPanel = () => {
    const [tasks, setTasks] = useState([]);
    const [credit, setCredit] = useState(0);
    const [username, setUsername] = useState("");

    const [reload, setReload] = useState(false);
    const [waitingTasks, setWaitingTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [global, setGlobal] = useState([]);

    // Fetch user's tasks and credit
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const username = localStorage.getItem("username");
                setUsername(username);
                const userId = localStorage.getItem("id");

                const response = await api.get(`/api/users/data/${userId}`);

                setTasks(response.data.tasks);
                setCredit(response.data.credit);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        const fetchWaitingTasks = async () => {
            try {
                const userId = localStorage.getItem("id");
                const response = await api.get(`/api/users/waiting/${userId}`);

                setWaitingTasks(response.data.tasks);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        const fetchCompletedTasks = async () => {
            try {
                const userId = localStorage.getItem("id");
                const response = await api.get(
                    `/api/users/completed/${userId}`
                );

                setCompletedTasks(response.data.tasks);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        const fetchGlobalTasks = async () => {
            try {
                const response = await api.get(`/api/users/global`);

                setGlobal(response.data.tasks);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        const fetchAllData = async () => {
            await fetchUserData();
            await fetchWaitingTasks();
            await fetchCompletedTasks();
            await fetchGlobalTasks();
        };

        fetchAllData();
    }, [reload]);

    const handleCompleteTask = async e => {
        const taskId = e.target.value;

        try {
            const response = await api.post(`/api/users/complete`, {
                taskId: taskId,
                status: "waiting",
            });

            setReload(!reload);
        } catch (err) {
            console.error("Error completing task:", err);
        }
    };

    const handleCompleteGlobalTask = async e => {
        const taskId = e.target.value;
        const userId = localStorage.getItem("id");

        try {
            const response = await api.post(`/api/users/complete/global`, {
                taskId: taskId,
                userId: userId,
                username: username,
                status: "waiting",
            });

            setReload(!reload);
        } catch (err) {
            console.error("Error completing task:", err);
        }
    };

    return (
        <Box padding={2}>
            {/* Logout */}
            <Button
                variant="contained"
                color="error"
                onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                }}
            >
                Logout
            </Button>
            {/* Go to Admin */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    window.location.href = "/admin";
                }}
            >
                Admin
            </Button>
            <Typography variant="h4" gutterBottom>
                Welcome {username}!
            </Typography>
            {/* User credit */}
            <Typography variant="h6" gutterBottom>
                Your Credit: ${credit.toFixed(2)}
            </Typography>

            {/* Personal cleaning tasks */}
            <Typography variant="h6" gutterBottom>
                Your Personal Cleaning Tasks
            </Typography>
            <Paper elevation={3}>
                <Table sx={{ marginBottom: 5 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Credit</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>
                                    {`$${(task.credit / 10).toFixed(2)}`}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        value={task.id}
                                        onClick={handleCompleteTask}
                                    >
                                        Complete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Typography variant="h6" gutterBottom>
                Global Tasks
            </Typography>
            <Paper elevation={3}>
                <Table sx={{ marginBottom: 5 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Credit</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {global.map(task => (
                            <TableRow key={task.id}>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>
                                    {`$${(task.credit / 10).toFixed(2)}`}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        value={task.id}
                                        onClick={handleCompleteGlobalTask}
                                    >
                                        Complete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            {/* Personal cleaning tasks */}
            <Typography variant="h6" gutterBottom>
                Tasks Waiting approval
            </Typography>
            <Paper elevation={3}>
                <Table sx={{ marginBottom: 5 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Credit</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {waitingTasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>
                                    {`$${(task.credit / 10).toFixed(2)}`}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        value={task.id}
                                        disabled
                                        onClick={handleCompleteTask}
                                    >
                                        Waiting...
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            {/* Personal cleaning tasks */}
            <Typography variant="h6" gutterBottom>
                Completed Tasks
            </Typography>
            <Paper elevation={3}>
                <Table sx={{ marginBottom: 5 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Credit</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {completedTasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>
                                    {`$${(task.credit / 10).toFixed(2)}`}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        value={task.id}
                                        disabled
                                        onClick={handleCompleteTask}
                                    >
                                        Completed!
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default UserPanel;

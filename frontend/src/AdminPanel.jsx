// src/AdminPanel.jsx
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
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material";
import api from "./apiInstance";

const AdminPanel = () => {
    const [tasks, setTasks] = useState([]);
    const [awaitingTasks, setAwaitingTasks] = useState([]);
    const [username, setUsername] = useState("");
    const [admin, setAdmin] = useState("false");

    const [reload, setReload] = useState(false);

    const [user, setUser] = useState("");
    const [taskChange, setTaskChange] = useState("");
    const [repeat, setRepeat] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [description, setDescription] = useState("");
    const [credit, setCredit] = useState(0);

    // Fetch pending tasks for review
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get("/api/admin/tasks");
                const username = localStorage.getItem("username");
                const admin = localStorage.getItem("admin");
                setUsername(username);
                setAdmin(admin);

                setTasks(response.data.tasks);
            } catch (err) {
                console.error("Error fetching pending tasks:", err);
            }
        };

        const fetchAwaitingTasks = async () => {
            try {
                const response = await api.get("/api/admin/pending-tasks");
                setAwaitingTasks(response.data.tasks);
            } catch (error) {
                console.error("Error fetching awaiting tasks:", error);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const response = await api.get("/api/admin/users");
                setAllUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };

        const fetchAll = async () => {
            fetchTasks();
            fetchAwaitingTasks();
            fetchAllUsers();
        };

        fetchAll();
    }, [reload]);

    const handleUserChange = event => {
        setUser(event.target.value);
    };

    const handleTaskChange = event => {
        setTaskChange(event.target.value);
    };

    const handleRepeatChange = event => {
        setRepeat(event.target.value);
    };

    const handleDescriptionChange = event => {
        setDescription(event.target.value);
    };

    const handleCreditChange = event => {
        setCredit(event.target.value);
    };

    const handleSubmitTask = async () => {
        try {
            let findUser;
            //find username based on user id
            let response;
            if (!user) {
                response = await api.post("/api/admin/add-task", {
                    user_id: 0,
                    type: taskChange,
                    description: description,
                    repeat_count: repeat,
                    credit: credit,
                    username: "Global",
                });
            } else {
                findUser = allUsers.find(u => u.id === user).name;
                response = await api.post("/api/admin/add-task", {
                    user_id: user,
                    type: taskChange,
                    description: description,
                    repeat_count: repeat,
                    credit: credit,
                    username: findUser,
                });
            }

            setReload(!reload);
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleNonApprovalChange = async event => {
        const taskId = event.target.value;

        try {
            const response = await api.post("/api/admin/update-task", {
                taskId: taskId,
                status: "pending",
            });

            setReload(!reload);
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const handleDeleteTask = async event => {
        const taskId = event.target.value;

        try {
            const response = await api.delete(
                `/api/admin/delete-task/${taskId}`
            );
            setReload(!reload);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleApproval = async event => {
        const taskId = event.target.value;
        const credit = event.target.getAttribute("data-credit");
        const user_id = event.target.getAttribute("data-user_id");

        try {
            const response = await api.put("/api/admin/update-credit", {
                taskId: taskId,
                credit: credit,
                user_id: user_id,
                status: "approved",
            });

            setReload(!reload);
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    return (
        <>
            {admin === "false" ? (
                <>
                    <Box padding={2}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                            }}
                        >
                            Go Back
                        </Button>
                        <Typography variant="h4" gutterBottom>
                            You are not authorized to view this page.
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Box padding={2}>
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

                        {/* Add Task modal*/}

                        <Box padding={2}>
                            <Typography variant="h6" gutterBottom>
                                Add Task
                            </Typography>
                            <InputLabel id="demo-simple-select-label">
                                Name
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={user}
                                label="Age"
                                onChange={handleUserChange}
                                sx={{ width: "100%", marginBottom: 2 }}
                            >
                                {allUsers.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <InputLabel id="demo-simple-select-label">
                                Task Type
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={taskChange}
                                label="Age"
                                onChange={handleTaskChange}
                                sx={{ width: "100%", marginBottom: 2 }}
                            >
                                <MenuItem value={1}>Global</MenuItem>
                                <MenuItem value={2}>Personal</MenuItem>
                            </Select>
                            <InputLabel id="demo-simple-select-label">
                                Repeat?
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={repeat}
                                label="Age"
                                onChange={handleRepeatChange}
                                sx={{ width: "100%", marginBottom: 2 }}
                            >
                                <MenuItem value={1}>Once</MenuItem>
                                <MenuItem value={2}>Daily</MenuItem>
                            </Select>
                            <TextField
                                label="Description"
                                fullWidth
                                value={description}
                                onChange={handleDescriptionChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Credit"
                                fullWidth
                                value={credit}
                                onChange={handleCreditChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitTask}
                            >
                                Add Task
                            </Button>
                        </Box>

                        <Typography variant="h4" gutterBottom>
                            Welcome {username}!
                        </Typography>

                        {/* Pending cleaning tasks */}
                        <Typography variant="h6" gutterBottom>
                            Waiting for Approval
                        </Typography>
                        <Paper elevation={3}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Credit</TableCell>
                                        <TableCell>Actions</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {awaitingTasks.map(task => (
                                        <TableRow key={task.id}>
                                            <TableCell>
                                                {task.username}
                                            </TableCell>
                                            <TableCell>
                                                {task.description}
                                            </TableCell>
                                            <TableCell>{task.status}</TableCell>
                                            <TableCell>{`$${(
                                                task.credit / 10
                                            ).toFixed(2)}`}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    value={task.id}
                                                    data-credit={task.credit}
                                                    data-user_id={task.user_id}
                                                    onClick={handleApproval}
                                                >
                                                    Approve
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    value={task.id}
                                                    onClick={
                                                        handleNonApprovalChange
                                                    }
                                                >
                                                    Don't Approve
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Box>
                    <Box padding={2}>
                        {/* Pending cleaning tasks */}
                        <Typography variant="h6" gutterBottom>
                            Pending Cleaning Tasks
                        </Typography>
                        <Paper elevation={3}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Credit</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasks.map(task => (
                                        <TableRow key={task.id}>
                                            <TableCell>
                                                {task.username}
                                            </TableCell>
                                            <TableCell>
                                                {task.description}
                                            </TableCell>
                                            <TableCell>{task.status}</TableCell>
                                            <TableCell>{`$${(
                                                task.credit / 10
                                            ).toFixed(2)}`}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    value={task.id}
                                                    onClick={handleDeleteTask}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Box>
                </>
            )}
        </>
    );
};

export default AdminPanel;

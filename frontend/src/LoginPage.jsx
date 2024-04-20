import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import api from "./apiInstance";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async e => {
        e.preventDefault();

        try {
            const response = await api.post("/api/users/login", {
                email,
                password,
            });

            // Handle successful login

            // Do something with the response data (e.g., save token, redirect)
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.user.name);
            localStorage.setItem("email", response.data.user.email);
            localStorage.setItem("id", response.data.user.id);
            localStorage.setItem("admin", response.data.user.admin);

            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error("Error logging in:", error.response.data);
                // Display error message to user
                setError(error.response.data.message || "Login failed");
            } else {
                // Other errors (e.g., network issues)
                console.error("An error occurred:", error.message);
                // Display error message to user
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage;

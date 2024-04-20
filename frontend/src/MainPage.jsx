import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
                backgroundColor: "#121212", // Dark mode background color
            }}
        >
            <Typography variant="h2" color="white" gutterBottom>
                Welcome to Clean House App!
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/login")}
                >
                    Login
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/register")}
                >
                    Register
                </Button>
            </Box>
        </Container>
    );
};

export default MainPage;

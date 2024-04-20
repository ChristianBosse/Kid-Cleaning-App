import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import darkTheme from "./theme";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import UserPanel from "./UserPanel";
import MainPage from "./MainPage";
import AdminPanel from "./AdminPanel";

const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<UserPanel />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    {/* Add other routes here */}
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;

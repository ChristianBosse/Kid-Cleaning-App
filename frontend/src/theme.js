import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
        background: {
            default: "#121212",
            paper: "#1f1f1f",
        },
        text: {
            primary: "#ffffff",
            secondary: "#b0bec5",
        },
    },
});

export default darkTheme;

import { createContext, useState, useContext } from "react";

// Create the context
const ThemeContext = createContext();

// Create the provider
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light"); // Default to light theme

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Create a custom hook for accessing the theme context
export const useTheme = () => useContext(ThemeContext);

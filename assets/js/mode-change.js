// Change theme mode and save to cookie
function changeMode() {
    let theme = document.body.getAttribute("data-theme");
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (theme === null) {
        theme = isDark ? "dark" : "light";
    }
    theme = theme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", theme);
    document.cookie = `theme=${theme}; max-age=31536000; SameSite=Lax; path=/`;
    
    // Debug: Check button styles after theme switch
    const modeButton = document.getElementById("mode");
    console.log("Button position after switch:", window.getComputedStyle(modeButton).position);
}

// Get cookie by name (fixed syntax)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}

// Add event load to check cookie for theme preference and set the theme
window.addEventListener("load", () => {
    const theme = getCookie("theme");
    if (theme) {
        document.body.setAttribute("data-theme", theme);
    }
});

// Auto change theme based on prefers-color-scheme
function autoChangeMode() {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let theme = document.body.getAttribute("data-theme");
    if (theme === null || theme === "auto") {
        theme = isDark ? "dark" : "light";
        document.body.setAttribute("data-theme", theme);
    }
}

// Make it priority to load before other scripts
document.addEventListener("DOMContentLoaded", function () {
    // Add event listener to mode button
    document.getElementById("mode").addEventListener("click", changeMode);
    // Add event listener for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", autoChangeMode);
});
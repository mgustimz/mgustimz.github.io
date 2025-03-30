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
    
    const modeText = document.getElementById("mode-text");
    modeText.textContent = theme === "dark" ? "🌕" : "☀️";
    
    const modeButton = document.getElementById("mode");
    console.log("Button position after switch:", window.getComputedStyle(modeButton).position);
}

// Get cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}

// Set theme and emoji on load
window.addEventListener("load", () => {
    const theme = getCookie("theme");
    if (theme) {
        document.body.setAttribute("data-theme", theme);
        const modeText = document.getElementById("mode-text");
        modeText.textContent = theme === "dark" ? "🌕" : "☀️";
    }
});

// Auto change theme based on prefers-color-scheme
function autoChangeMode() {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let theme = document.body.getAttribute("data-theme");
    if (theme === null || theme === "auto") {
        theme = isDark ? "dark" : "light";
        document.body.setAttribute("data-theme", theme);
        const modeText = document.getElementById("mode-text");
        modeText.textContent = theme === "dark" ? "🌕" : "☀️";
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("mode").addEventListener("click", changeMode);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", autoChangeMode);
});
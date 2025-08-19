
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// Default theme = blue
body.classList.add("theme-blue");

toggleBtn.addEventListener("click", () => {
    if (body.classList.contains("theme-blue")) {
        body.classList.replace("theme-blue", "theme-gold");
        toggleBtn.textContent = "Switch to Blue Theme";
    } else {
        body.classList.replace("theme-gold", "theme-blue");
        toggleBtn.textContent = "Switch to Gold Theme";
    }
});


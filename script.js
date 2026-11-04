/* =========================================================
   MAZZO - Hazem Sayed | script.js
   1. Dark / light theme button   (the required part)
   2. Personal greeting + form check
   3. Scroll reveal
   4. 3D tilt on the skill cards
   5. Back-to-top button
   6. Floating particles in the hero
   ========================================================= */


var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- 1. DARK / LIGHT THEME ---------- */

var themeToggle = document.getElementById("theme-toggle");

// Read the saved theme. try/catch keeps the page working if storage is blocked.
function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Storage is blocked: the theme still works, it just will not be remembered.
  }
}

// Keep the button's label in sync with the current theme (for screen readers)
function updateToggleLabel() {
  var isDark = document.body.classList.contains("dark");
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

// On page load: dark is the default. Only a saved "light" turns it off.
if (getSavedTheme() === "light") {
  document.body.classList.remove("dark");
}
updateToggleLabel();

// Switch on the smooth colour transition AFTER the first paint (no flash on load)
window.requestAnimationFrame(function () {
  document.body.classList.add("theme-ready");
});

// The click: add or remove the class "dark" on <body>. The colours are all in the CSS.
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  var isDark = document.body.classList.contains("dark");
  saveTheme(isDark ? "dark" : "light");
  updateToggleLabel();
});


/* ---------- 2. GREETING + FORM CHECK ---------- */

var contactForm = document.getElementById("contact-form");
var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var greeting = document.getElementById("greeting");
var nameError = document.getElementById("name-error");
var emailError = document.getElementById("email-error");
var formStatus = document.getElementById("form-status");

var defaultGreeting = greeting.textContent;

// Update the greeting while the visitor types their name
nameInput.addEventListener("input", function () {
  var visitorName = nameInput.value.trim();

  if (visitorName === "") {
    greeting.textContent = defaultGreeting;
  } else {
    greeting.textContent = "Welcome aboard, " + visitorName + "!";
  }
});

// Show or clear an error under a field
function setError(input, errorElement, message) {
  errorElement.textContent = message;
  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // there is no backend, so we never send anything

  var nameOk = nameInput.value.trim() !== "";
  var emailOk = emailInput.value.trim() !== "" && emailInput.checkValidity();

  setError(nameInput, nameError, nameOk ? "" : "Please enter your name.");

  if (emailInput.value.trim() === "") {
    setError(emailInput, emailError, "Please enter your email.");
  } else if (!emailOk) {
    setError(emailInput, emailError, "Please enter a valid email, like you@example.com.");
  } else {
    setError(emailInput, emailError, "");
  }

  if (nameOk && emailOk) {
    formStatus.className = "form-status ok";
    formStatus.textContent = "Looks good, " + nameInput.value.trim() + "! (This is a demo page with no backend, so nothing was sent.)";
  } else {
    formStatus.className = "form-status";
    formStatus.textContent = "";
  }
});


/* ---------- 3. SCROLL REVEAL ---------- */

var revealItems = document.querySelectorAll(".reveal");

if (!reduceMotion && "IntersectionObserver" in window) {
  var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // reveal only once
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(function (item) {
    item.classList.add("will-reveal");
    revealObserver.observe(item);
  });
}


/* ---------- 4. 3D TILT ON THE SKILL CARDS ---------- */

var cards = document.querySelectorAll(".card");
var canHover = window.matchMedia("(hover: hover)").matches;

if (!reduceMotion && canHover) {
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (event) {
      var box = card.getBoundingClientRect();
      var x = (event.clientX - box.left) / box.width - 0.5;  // -0.5 (left) to 0.5 (right)
      var y = (event.clientY - box.top) / box.height - 0.5;  // -0.5 (top) to 0.5 (bottom)

      card.style.setProperty("--ry", (x * 12) + "deg");
      card.style.setProperty("--rx", (-y * 12) + "deg");
    });

    card.addEventListener("mouseleave", function () {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}


/* ---------- 5. BACK-TO-TOP BUTTON ---------- */

var toTop = document.getElementById("to-top");

window.addEventListener("scroll", function () {
  if (window.scrollY > 600) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }
}, { passive: true });


/* ---------- 6. FLOATING PARTICLES ---------- */

var particleBox = document.getElementById("particles");

if (!reduceMotion) {
  for (var i = 0; i < 22; i++) {
    var dot = document.createElement("span");
    dot.className = "particle";
    dot.style.setProperty("--x", (Math.random() * 100) + "%");
    dot.style.setProperty("--s", (2 + Math.random() * 4) + "px");
    dot.style.setProperty("--d", (9 + Math.random() * 10) + "s");
    dot.style.setProperty("--delay", "-" + (Math.random() * 14) + "s");
    dot.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
    particleBox.appendChild(dot);
  }
}

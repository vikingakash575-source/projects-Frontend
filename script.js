
"use strict";

// ========================================
// 1. AUTOMATIC FOOTER YEAR
// ========================================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ========================================
// 2. MOBILE NAVIGATION
// ========================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    function closeMenu() {
        navLinks.classList.remove("open");

        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open navigation");
        menuBtn.textContent = "☰";
    }

    function openMenu() {
        navLinks.classList.add("open");

        menuBtn.setAttribute("aria-expanded", "true");
        menuBtn.setAttribute("aria-label", "Close navigation");
        menuBtn.textContent = "✕";
    }

    // Toggle the mobile menu.
    menuBtn.addEventListener("click", () => {
        const isOpen =
            menuBtn.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close the menu after clicking a navigation link.
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Close the menu using the Escape key.
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            menuBtn.getAttribute("aria-expanded") === "true"
        ) {
            closeMenu();
            menuBtn.focus();
        }
    });

    // Close the menu when clicking outside the navigation.
    document.addEventListener("click", (event) => {
        if (
            menuBtn.getAttribute("aria-expanded") === "true" &&
            !navLinks.contains(event.target) &&
            !menuBtn.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Reset the menu when returning to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 650) {
            closeMenu();
        }
    });
}
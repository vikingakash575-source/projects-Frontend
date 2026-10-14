
"use strict";

// Automatically display the current year.
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// MOBILE NAVIGATION MENU

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
    if (!menuBtn || !navLinks) return;

    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Toggle navigation");
    menuBtn.textContent = "☰";
}

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", function () {

        const opened = navLinks.classList.toggle("open");

        menuBtn.setAttribute("aria-expanded", String(opened));
        menuBtn.textContent = opened ? "✕" : "☰";

    });

    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", closeMenu);

    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMenu();
            menuBtn.focus();
        }

    });
}


// ANIMATED TYPING EFFECT

const typing = document.getElementById("typing");

const words = [
    "digital experiences",
    "creative websites",
    "useful solutions",
    "ideas into code"
];

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (typing && !reducedMotion) {

    let wordIndex = 0;
    let characterIndex = words[0].length;
    let deleting = true;

    function typeEffect() {

        const currentWord = words[wordIndex];

        if (deleting) {

            characterIndex--;

            typing.textContent =
                currentWord.substring(0, characterIndex);

            if (characterIndex <= 0) {

                deleting = false;

                wordIndex = (wordIndex + 1) % words.length;

                setTimeout(typeEffect, 300);

                return;
            }

            setTimeout(typeEffect, 45);

        } else {

            const nextWord = words[wordIndex];

            characterIndex++;

            typing.textContent =
                nextWord.substring(0, characterIndex);

            if (characterIndex >= nextWord.length) {

                deleting = true;

                setTimeout(typeEffect, 1400);

                return;
            }

            setTimeout(typeEffect, 70);
        }
    }

    setTimeout(typeEffect, 1500);

} else if (typing) {

    typing.textContent = words[0];

}


// SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion) {

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(function (element) {

        element.classList.add("visible");

    });

}


// ANIMATED PARTICLE BACKGROUND

const canvas = document.getElementById("particles");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx && !reducedMotion) {

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let animationFrame;
    let lastTime = 0;

    function resizeCanvas() {

        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            1.5
        );

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        const particleCount = Math.min(
            width < 650 ? 35 : 65,
            Math.floor(width / 15)
        );

        particles = [];

        for (let i = 0; i < particleCount; i++) {

            particles.push({

                x: Math.random() * width,
                y: Math.random() * height,

                radius: Math.random() * 1.5 + 0.5,

                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,

                phase: Math.random() * Math.PI * 2,

                hue: Math.random() > 0.5 ? 185 : 270

            });

        }
    }

    function drawParticles(timestamp = 0) {

        // Limit background work when the screen is busy.
        if (timestamp - lastTime < 25) {
            animationFrame = requestAnimationFrame(drawParticles);
            return;
        }

        lastTime = timestamp;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {

            const p = particles[i];

            p.x += p.speedX;
            p.y += p.speedY;
            p.phase += 0.025;

            // Reappear at the opposite edge.
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            const opacity =
                0.35 + (Math.sin(p.phase) + 1) * 0.2;

            ctx.beginPath();

            ctx.fillStyle =
                `hsla(${p.hue}, 100%, 72%, ${opacity})`;

            ctx.shadowBlur = 8;
            ctx.shadowColor =
                `hsla(${p.hue}, 100%, 65%, 0.6)`;

            ctx.arc(
                p.x,
                p.y,
                p.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.shadowBlur = 0;

            // Connect nearby particles.
            for (let j = i + 1; j < particles.length; j++) {

                const other = particles[j];

                const dx = p.x - other.x;
                const dy = p.y - other.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < 100) {

                    ctx.beginPath();

                    ctx.strokeStyle =
                        `rgba(70, 140, 255, ${
                            (1 - distance / 100) * 0.12
                        })`;

                    ctx.lineWidth = 0.6;

                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);

                    ctx.stroke();
                }
            }
        }

        animationFrame = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();

    drawParticles();

    let resizeTimer;

    window.addEventListener("resize", function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(resizeCanvas, 150);

    });

    // Pause the animation while the browser tab is hidden.
    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {

            cancelAnimationFrame(animationFrame);

        } else {

            lastTime = 0;
            drawParticles();

        }

    });

}


// CONTACT FORM

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const data = new FormData(contactForm);

        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        const phone = String(data.get("phone") || "").trim();
        const subject = String(data.get("subject") || "").trim();
        const message = String(data.get("message") || "").trim();

        const emailBody =
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone || "Not provided"}\n\n` +
            `Message:\n${message}`;

        const mailto =
            "mailto:viking.akash575@gmail.com" +
            "?subject=" +
            encodeURIComponent("[Portfolio] " + subject) +
            "&body=" +
            encodeURIComponent(emailBody);

        if (formMessage) {

            formMessage.textContent =
                "Opening your email app. Press Send in that app to send your message.";

        }

        window.location.href = mailto;

    });

}
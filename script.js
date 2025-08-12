gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);

function lenisScroll() {
    const lenis = new Lenis({ duration: 1.5 });
    (function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    })();
}

function ImgScroller() {
    const track = document.querySelector(".image-scroller");
    if (!track) return;

    const baseSpeed = 2;
    let direction = 1, scrollBoost = 0, currentX = 0;

    track.innerHTML += track.innerHTML;
    const contentWidth = track.scrollWidth / 2;
    let lastScroll = window.scrollY;

    ScrollTrigger.create({
        onUpdate: () => {
            const newScroll = window.scrollY, delta = newScroll - lastScroll;
            direction = delta > 0 ? 1 : delta < 0 ? -1 : direction;
            scrollBoost += Math.abs(delta) * 0.1;
            lastScroll = newScroll;
        }
    });

    (function animate() {
        let speed = baseSpeed + scrollBoost;
        currentX += speed * direction;
        if (direction === 1 && currentX >= contentWidth) currentX -= contentWidth;
        if (direction === -1 && currentX <= 0) currentX += contentWidth;
        track.style.transform = `translateX(${-currentX}px)`;
        scrollBoost *= 0.9;
        requestAnimationFrame(animate);
    })();
}

function textRevealAnimation() {
    document.fonts.ready.then(() => {
        gsap.set(".about-heading", { opacity: 1 });
        const split = SplitText.create(".about-heading", {
            type: "words,lines",
            linesClass: "line",
            autoSplit: true,
            mask: "lines"
        });
        gsap.timeline({
            scrollTrigger: {
                trigger: '.section',
                start: '20% 68%',
                scrub: false,
                toggleActions: 'play reverse play reverse',
            }
        }).from(split.lines, {
            yPercent: 100,
            opacity: 0,
            duration: 2,
            ease: "expo.out",
            stagger: 0.2
        });
    });
}

function ScrambletextAnimation() {
    document.querySelectorAll(".scramble").forEach((el) => {
        const originalText = el.textContent;
        gsap.fromTo(el, {
            scrambleText: { text: "", chars: "upperAndLowerCase" }
        }, {
            duration: 2,
            scrambleText: { text: originalText, chars: "upperAndLowerCase" }
        });
        ["mouseenter", "mouseleave"].forEach(evt => {
            el.addEventListener(evt, () => {
                gsap.to(el, {
                    duration: 0.6,
                    scrambleText: { text: originalText, chars: "upperAndLowerCase" }
                });
            });
        });
    });
}

Shery.mouseFollower();
lenisScroll();
ScrambletextAnimation();
textRevealAnimation();
ImgScroller();

gsap.utils.toArray("div[data-speed]").forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 1;
    gsap.to(el, {
        y: () => -(window.innerHeight * speed / 10),
        ease: "none",
        scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });
});

const magneticElement = document.querySelector('.about-circle');
if (magneticElement) {
    const strength = 400;
    magneticElement.addEventListener('mousemove', (e) => {
        const bounds = magneticElement.getBoundingClientRect();
        const moveX = ((e.clientX - bounds.left - bounds.width / 2) / bounds.width) * strength;
        const moveY = ((e.clientY - bounds.top - bounds.height / 2) / bounds.height) * strength;
        gsap.to(magneticElement, { x: moveX, y: moveY, duration: 0.4, ease: 'power3.out' });
    });
    magneticElement.addEventListener('mouseleave', () => {
        gsap.to(magneticElement, { x: 0, y: 0, duration: 1.3, ease: 'power2.out' });
    });
}

window.addEventListener("load", () => {
    const headings = document.querySelectorAll(".hero-heading");
    if (headings.length) {
        gsap.set(headings, { opacity: 1 });
        gsap.from(headings, {
            y: -300,
            scale: 0.8,
            rotation: () => gsap.utils.random(-10, 10),
            opacity: 0,
            ease: "bounce.out",
            duration: 2,
            stagger: 0.2,
            delay: 1
        });
    }
});

window.addEventListener("load", () => {
    const fill = document.querySelector(".loader-fill");
    const percent = document.querySelector(".loader-percentage");
    if (!fill || !percent) return;
    let progress = { value: 0 };
    gsap.to(progress, {
        value: 100,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
            fill.style.width = progress.value + "%";
            percent.textContent = Math.round(progress.value) + "%";
        },
        onComplete: () => {
            gsap.to("#preloader", {
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    const preloader = document.getElementById("preloader");
                    if (preloader) preloader.style.display = "none";
                    document.body.style.overflow = "auto";
                }
            });
        }
    });
});

gsap.to(".box", {
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    delay: 1.3
});

document.querySelectorAll(".project-box").forEach((box) => {
    const isMobile = window.innerWidth <= 768; // mobile check

    const img = box.querySelector("img");
    const h1 = box.querySelector("h1");
    const h6 = box.querySelector("h6");

    if (!isMobile) {
        // ✅ Mousemove effect only for desktop
        let prevX = 0;
        box.addEventListener("mousemove", (e) => {
            const rect = box.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            const diff = e.clientX - prevX;
            prevX = e.clientX;
            gsap.to(img, {
                opacity: 1,
                ease: "power3.out",
                top: relY - img.offsetHeight / 2,
                left: relX - img.offsetWidth / 2,
                rotate: gsap.utils.clamp(-20, 20, diff * 0.5)
            });
            if (h1) h1.style.opacity = 0.2;
            if (h6) h6.style.opacity = 0.2;
        });

        box.addEventListener("mouseleave", () => {
            gsap.to(img, { opacity: 0, ease: "power3.out" });
            if (h1) h1.style.opacity = 1;
            if (h6) h6.style.opacity = 1;
        });
    } else {
        // ✅ Mobile me image always visible
        img.style.opacity = 1;
    }
});

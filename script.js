gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);


function lenisScroll() {
    const lenis = new Lenis({
        duration: 1.5
    });

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf);

};

function ImgScroller() {
    const track = document.querySelector(".image-scroller");

    const baseSpeed = 2; // normal marquee speed
    let direction = 1;   // 1 = right, -1 = left
    let scrollBoost = 0;
    let currentX = 0;

    // Duplicate images for seamless loop
    track.innerHTML += track.innerHTML;
    const contentWidth = track.scrollWidth / 2;

    // Scroll trigger velocity detection
    let lastScroll = window.scrollY;

    ScrollTrigger.create({
        onUpdate: () => {
            const newScroll = window.scrollY;
            const delta = newScroll - lastScroll;

            if (delta > 0) {
                direction = 1; // Scroll down = right
            } else if (delta < 0) {
                direction = -1; // Scroll up = left
            }

            scrollBoost += Math.abs(delta) * 0.1; // boost based on speed
            lastScroll = newScroll;
        }
    });

    // Animate frame-by-frame
    function animate() {
        let speed = baseSpeed + scrollBoost;
        currentX += speed * direction;

        // Loop logic
        if (direction === 1 && currentX >= contentWidth) {
            currentX -= contentWidth;
        }
        if (direction === -1 && currentX <= 0) {
            currentX += contentWidth;
        }

        track.style.transform = `translateX(${-currentX}px)`;
        scrollBoost *= 0.9; // smooth slowdown

        requestAnimationFrame(animate);
    }

    animate();
};

function textRevealAnimation() {
    document.fonts.ready.then(() => {
        gsap.set(".about-heading ", { opacity: 1 });

        const split = SplitText.create(".about-heading", {
            type: "words,lines",
            linesClass: "line",
            autoSplit: true,
            mask: "lines"
        });

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.section',
                start: '20% 68%',
                markers: true,
                scrub: false,
                toggleActions: 'play reverse play reverse',
            }
        });

        tl.from(split.lines, {
            yPercent: 100,
            opacity: 0,
            duration: 2,
            ease: "expo.out",
            stagger: 0.2
        });
    });
};

function ScrambletextAnimation() {
    document.querySelectorAll(".scramble").forEach((el) => {
        const originalText = el.textContent;

        // 🔥 Animate once on page load
        gsap.fromTo(el,
            {
                scrambleText: {
                    text: "",
                    chars: "upperAndLowerCase"
                }
            },
            {
                duration: 2,
                scrambleText: {
                    text: originalText,
                    chars: "upperAndLowerCase"
                }
            }
        );

        // // 🖱 Hover enter
        el.addEventListener("mouseenter", () => {
            gsap.to(el, {
                duration: 0.6,
                scrambleText: {
                    text: originalText,
                    chars: "upperAndLowerCase"
                }
            });
        });

        // 🖱 Hover leave
        el.addEventListener("mouseleave", () => {
            gsap.to(el, {
                duration: 0.6,
                scrambleText: {
                    text: originalText,
                    chars: "upperAndLowerCase"
                }
            });
        });
    });
};



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
            // markers: true // uncomment for debug
        }
    });
});


const magneticElement = document.querySelector('.about-circle');
const strength = 400; // max movement in px

magneticElement.addEventListener('mousemove', (e) => {
    const bounds = magneticElement.getBoundingClientRect();
    const relX = e.clientX - bounds.left;
    const relY = e.clientY - bounds.top;

    const moveX = (relX - bounds.width / 2) / bounds.width * strength;
    const moveY = (relY - bounds.height / 2) / bounds.height * strength;

    gsap.to(magneticElement, {
        x: moveX,
        y: moveY,
        duration: 0.4,
        ease: 'power3.out'
    });
});

magneticElement.addEventListener('mouseleave', () => {
    gsap.to(magneticElement, {
        x: 0,
        y: 0,
        duration: 1.3, // 👈 reduced duration
        ease: 'power2.out' // 👈 smoother, non-bouncy
    });
});



window.addEventListener("load", () => {
    const headings = document.querySelectorAll(".hero-heading");

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
});


window.addEventListener("load", () => {
    const fill = document.querySelector(".loader-fill");
    const percent = document.querySelector(".loader-percentage");

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
                    document.getElementById("preloader").style.display = "none";
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
    ease: "power3.out", // smooth zoom effect
    delay: 1.2
});



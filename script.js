document.addEventListener('DOMContentLoaded', () => {
    // Nav Overlay Toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navOverlay = document.getElementById('navOverlay');
    const popupLinks = document.querySelectorAll('.popup-link');

    if (hamburgerBtn && navOverlay) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navOverlay.classList.toggle('active');
            
            // Toggle body scroll to prevent scrolling while menu is open
            if (navOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking any link inside
        popupLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    const parallaxElements = document.querySelectorAll('.parallax');

    // Add a subtle parallax effect on mousemove
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX) / 100;
        const y = (window.innerHeight - e.pageY) / 100;

        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.05;
            
            // Get original transform values from CSS to maintain the rotation
            // A simplified approach is just to apply the translation on top of the base transform
            // But getting computed transform is tricky, so we'll just apply translation.
            
            // For a better effect, we can apply it via CSS variables or wrapper, 
            // but simple inline transform adjustment works for this effect.
            // Since we applied initial transforms in CSS, we should ideally use a wrapper 
            // or preserve the initial transform. Let's do a simple x/y transform on the element.
            
            // Extract the base transform from the stylesheet for each item manually 
            // or just use translation to add onto it. 
            // Using a CSS custom property is cleaner:
            el.style.transform = `translateX(${x * speed * 100}px) translateY(${y * speed * 100}px) ${getInitialTransform(el)}`;
        });
    });

    // Helper to preserve the initial rotation we set in CSS
    function getInitialTransform(el) {
        if (el.classList.contains('item-1')) return 'rotate(-8deg)';
        if (el.classList.contains('item-2')) return 'rotate(6deg)';
        if (el.classList.contains('item-3')) return 'rotate(-4deg)';
        if (el.classList.contains('item-4')) return 'rotate(-7deg)';
        if (el.classList.contains('item-5')) return 'rotate(5deg)';
        if (el.classList.contains('item-6')) return 'rotate(12deg)';
        return '';
    }

    // Interactive Eyes Tracking
    const eyes = document.querySelectorAll('.interactive-eye .pupil');
    if (eyes.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            eyes.forEach(pupil => {
                const eyeContainer = pupil.parentElement;
                const rect = eyeContainer.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;

                const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
                
                // Max distance the pupil can move from center
                const maxDistX = 4; // (24 - 16) / 2
                const maxDistY = 7; // (36 - 22) / 2

                const x = Math.cos(angle) * maxDistX;
                const y = Math.sin(angle) * maxDistY;

                // Stretch multiplier so it doesn't snap instantly to edge
                const distFromCenter = Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY);
                const distanceRatio = Math.min(distFromCenter / 150, 1);

                pupil.style.transform = `translate(${x * distanceRatio}px, ${y * distanceRatio}px)`;
            });
        });
    }

    // Scroll Progress and Back to Top
    const progressBar = document.getElementById('progressBar');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }

        if (backToTopBtn) {
            if (winScroll > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

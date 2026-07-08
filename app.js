
document.addEventListener('DOMContentLoaded', () => {

    // main elements
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const scrollProgress = document.getElementById('scroll-progress');
    const mainHeader = document.querySelector('.main-header');
    const backToTopBtn = document.getElementById('back-to-top');

    // Theme Toggle
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.classList.toggle('theme-light', savedTheme === 'light');
    updateThemeButtonIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const isCurrentlyLight = htmlElement.classList.contains('theme-light');
        const newTheme = isCurrentlyLight ? 'dark' : 'light';

        htmlElement.classList.toggle('theme-light', newTheme === 'light');
        localStorage.setItem('theme', newTheme);
        updateThemeButtonIcon(newTheme);
    });

    function updateThemeButtonIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // navbar Section
    const navToggleBtn = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('mainNavbar');

    if (navToggleBtn && mainNav) {
        navToggleBtn.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            const icon = navToggleBtn.querySelector('i');
            icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        });

        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                navToggleBtn.querySelector('i').className = 'fas fa-bars';
            });
        });
    }


    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercentage = height > 0 ? (winScroll / height) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = scrolledPercentage + '%';
        }

        // back to top btn
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
            backToTopBtn.classList.add('show');
        } else {
            mainHeader.classList.remove('scrolled');
            backToTopBtn.classList.remove('show');
        }

        triggerCountersOnVisibility();
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Pricing Section
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    const counterTargets = [15420, 98, 99];

    function triggerCountersOnVisibility() {
        if (countersAnimated || counters.length === 0) return;

        const previewElement = document.querySelector('.product-preview');
        if (!previewElement) return;

        const rect = previewElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            countersAnimated = true;
            counters.forEach((counter, index) => {
                const target = counterTargets[index] || 0;
                const speed = 40; 
                const step = target / speed;
                let current = 0;

                const updateCount = () => {
                    current += step;
                    if (current < target) {
                        counter.innerText = Math.floor(current).toLocaleString();
                        setTimeout(updateCount, 25);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                updateCount();
            });
        }
    }
    triggerCountersOnVisibility();


    const billingToggle = document.getElementById('billing-toggle');
    const priceAmounts = document.querySelectorAll('.price-amount');
    const labelMonthly = document.getElementById('label-monthly');
    const labelYearly = document.getElementById('label-yearly');

    // billing toggle
    const pricingPlans = [
        { monthly: 19, yearly: 15 },
        { monthly: 49, yearly: 39 }
    ];

    if (billingToggle) {
        billingToggle.addEventListener('click', () => {
            const isYearly = billingToggle.classList.toggle('active');

            priceAmounts.forEach((price, index) => {
                const plan = pricingPlans[index];
                if (!plan) return;
                price.innerText = isYearly ? plan.yearly : plan.monthly;
            });

            if (isYearly) {
                labelYearly.classList.add('active');
                labelMonthly.classList.remove('active');
            } else {
                labelMonthly.classList.add('active');
                labelYearly.classList.remove('active');
            }
        });
    }

    // Slider Section
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    let activeSlideIndex = 0;

    function showSlide(index) {
        if (slides.length === 0) return;
        slides[activeSlideIndex].classList.remove('active');
        activeSlideIndex = (index + slides.length) % slides.length;
        slides[activeSlideIndex].classList.add('active');
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => showSlide(activeSlideIndex - 1));
        nextBtn.addEventListener('click', () => showSlide(activeSlideIndex + 1));

        // Automated rotation loop interval tracker
        setInterval(() => showSlide(activeSlideIndex + 1), 6000);
    }

    // FAQ Section Custom accordion
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.classList.contains('active');
            const panel = trigger.nextElementSibling;

            faqTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    otherTrigger.classList.remove('active');
                    otherTrigger.nextElementSibling.style.maxHeight = '0px';
                }
            });

            if (!isExpanded) {
                trigger.classList.add('active');
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                trigger.classList.remove('active');
                panel.style.maxHeight = '0px';
            }
        });
    });

    // Blogs API Fetch and Integration so blogs content is dynamic 
    const blogContainer = document.getElementById('blog-posts-container');

    if (blogContainer) {

        async function fetchBlogPosts() {
            try {
                // Fetching live sample posts from a public placeholder API
                const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
                const posts = await response.json();

                const spinner = document.getElementById('blog-spinner');
                if (spinner) spinner.remove();

                posts.forEach(post => {
                    const cardCol = document.createElement('article');
                    cardCol.className = 'blog-card';

                    cardCol.innerHTML = `
                    <div class="blog-body">
                        <span class="blog-badge">Engineering Ecosystem</span>
                        <h4>${escapeHtml(post.title.substring(0, 32))}...</h4>
                        <p class="small">${escapeHtml(post.body.substring(0, 110))}...</p>
                        <a href="#contact">Read Post Framework &rarr;</a>
                    </div>
                `;

                    blogContainer.appendChild(cardCol);
                });

            } catch (error) {
                const spinner = document.getElementById('blog-spinner');

                if (spinner) {
                    spinner.innerHTML =
                        "<p class='text-danger'>Failed to retrieve remote source data metrics fallback.</p>";
                }

                console.error(error);
            }
        }

        fetchBlogPosts();
    }

    // Basic escaping helper to keep injected API text safe
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Form Validation and local storage
    const form = document.getElementById('contactForm');
    const alertBox = document.getElementById('formAlertMessage');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('contactName').value.trim();
            const emailVal = document.getElementById('contactEmail').value.trim();
            const messageVal = document.getElementById('contactMessage').value.trim();
            let isValid = true;

            // Reset feedback visibility
            document.querySelectorAll('.error-feedback').forEach(el => el.classList.remove('show'));

            if (!nameVal) {
                document.getElementById('nameError').classList.add('show');
                isValid = false;
            }
            if (!emailVal || !emailVal.includes('@')) {
                document.getElementById('emailError').classList.add('show');
                isValid = false;
            }
            if (!messageVal) {
                document.getElementById('messageError').classList.add('show');
                isValid = false;
            }

            if (isValid) {
                const userPayload = {
                    name: nameVal,
                    email: emailVal,
                    message: messageVal,
                    submittedAt: new Date().toISOString()
                };

                // storing form response to local storage
                localStorage.setItem('saas_contact_data', JSON.stringify(userPayload));

                // Form submit message
                alertBox.className = "alert alert-success show text-center";
                alertBox.innerText = `${nameVal} Form has been submitted successfully.`;

                form.reset();
            }
        });
    }

    // image open functionality
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                if (!img.src) return;
                lightboxImg.src = img.src;
                lightbox.classList.add('open');
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightboxImg.src = '';
        }

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Close when clickingn
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }
});

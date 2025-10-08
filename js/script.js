// Navigation et scroll
class Portfolio {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.contactForm = document.getElementById('contact-form');
        this.sections = document.querySelectorAll('section');

        this.init();
    }

    init() {
        // Événements
        window.addEventListener('scroll', () => this.handleScroll());
        this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Navigation smooth
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Observer pour les animations des sections
        this.setupIntersectionObserver();

        // Initialisation
        this.setActiveNavLink();
    }

    handleScroll() {
        // Navbar background au scroll
        if (window.scrollY > 100) {
            this.navbar.classList.add('bg-white', 'shadow-lg');
            this.navbar.classList.remove('bg-transparent');
        } else {
            this.navbar.classList.remove('bg-white', 'shadow-lg');
            this.navbar.classList.add('bg-transparent');
        }

        // Mise à jour des liens actifs
        this.setActiveNavLink();
    }

    setActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    toggleMobileMenu() {
        const isHidden = this.mobileMenu.classList.contains('hidden');

        if (isHidden) {
            this.mobileMenu.classList.remove('hidden');
            this.mobileMenu.classList.add('mobile-menu-open');
            this.mobileMenu.classList.remove('mobile-menu-closed');
        } else {
            this.mobileMenu.classList.add('mobile-menu-closed');
            this.mobileMenu.classList.remove('mobile-menu-open');

            // Attendre la fin de l'animation avant de cacher
            setTimeout(() => {
                this.mobileMenu.classList.add('hidden');
            }, 300);
        }
    }

    handleNavClick(e) {
        e.preventDefault();

        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Fermer le menu mobile si ouvert
            if (!this.mobileMenu.classList.contains('hidden')) {
                this.toggleMobileMenu();
            }
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    entry.target.classList.remove('section-hidden');
                }
            });
        }, observerOptions);

        // Observer toutes les sections sauf l'accueil
        this.sections.forEach((section, index) => {
            if (index > 0) { // Skip first section (hero)
                section.classList.add('section-hidden');
                observer.observe(section);
            }
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Afficher le loader
        submitButton.innerHTML = '<div class="loader"></div>Envoi en cours...';
        submitButton.disabled = true;

        // Simuler l'envoi du formulaire
        try {
            await this.simulateFormSubmission();

            // Succès
            this.showNotification('Message envoyé avec succès !', 'success');
            this.contactForm.reset();

        } catch (error) {
            // Erreur
            this.showNotification('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');
        } finally {
            // Restaurer le bouton
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            // Simuler un délai réseau
            setTimeout(() => {
                // Pour la démo, on simule toujours un succès
                // En production, vous enverriez les données à votre backend
                const formData = new FormData(this.contactForm);
                console.log('Données du formulaire:', Object.fromEntries(formData));

                // 10% de chance d'erreur pour la démo
                if (Math.random() < 0.1) {
                    reject(new Error('Erreur réseau simulée'));
                } else {
                    resolve();
                }
            }, 2000);
        });
    }

    showNotification(message, type = 'info') {
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
                type === 'error' ? 'bg-red-500 text-white' :
                    'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        // Ajouter au DOM
        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('translate-x-0');
        }, 10);

        // Supprimer après 5 secondes
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Typing animation pour le titre
class TypingAnimation {
    constructor() {
        this.titles = ['Développeur Full Stack', 'Créatif Passionné', 'Développeur Python/JS'];
        this.currentTitleIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingElement = document.querySelector('#accueil .text-blue-600');

        if (this.typingElement) {
            this.type();
        }
    }

    type() {
        const currentTitle = this.titles[this.currentTitleIndex];

        if (this.isDeleting) {
            this.currentCharIndex--;
        } else {
            this.currentCharIndex++;
        }

        this.typingElement.textContent = currentTitle.substring(0, this.currentCharIndex);

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentCharIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause à la fin
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titles.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
    new TypingAnimation();
});

// Gestion du rechargement de la page pour le positionnement du scroll
window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});
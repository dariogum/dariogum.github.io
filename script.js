// Simple and reliable next-section functionality with scroll snap
let isScrolling = false;
let scrollTimeout;

// Function to snap to the nearest section
function snapToSection() {
    if (isScrolling) return;
    
    const sections = [
        { id: 'home', element: document.getElementById('home') },
        { id: 'classic', element: document.getElementById('classic') },
        { id: 'pea', element: document.getElementById('pea') },
        { id: 'rubi', element: document.getElementById('rubi') },
        { id: 'contact', element: document.getElementById('contact') }
    ];
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Find the section that should be snapped to
    let targetSection = sections[0];
    let minDistance = Infinity;
    
    sections.forEach(section => {
        if (section.element) {
            const rect = section.element.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const distance = Math.abs(scrollY - sectionTop);
            
            if (distance < minDistance) {
                minDistance = distance;
                targetSection = section;
            }
        }
    });
    
    // Only snap if we're not already at the target section
    if (targetSection && targetSection.element) {
        const targetRect = targetSection.element.getBoundingClientRect();
        if (Math.abs(targetRect.top) > 50) { // Only snap if we're more than 50px away
            isScrolling = true;
            targetSection.element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Reset scrolling flag after animation
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                updateNextSection(); // Update next section after snap
            }, 1000);
        }
    }
}

// Function to update the next-section indicator
function updateNextSection() {
    const nextSection = document.getElementById('next-section');
    if (!nextSection) return;
    
    const scrollText = nextSection.querySelector('.scroll-text');
    const scrollIcon = nextSection.querySelector('.scroll-icon');
    if (!scrollText || !scrollIcon) return;
    
    // Define sections in order
    const sections = [
        { id: 'home', name: 'Inicio', element: document.getElementById('home') },
        { id: 'classic', name: 'Clásico', element: document.getElementById('classic') },
        { id: 'pea', name: 'Pea', element: document.getElementById('pea') },
        { id: 'rubi', name: 'Rubi', element: document.getElementById('rubi') },
        { id: 'contact', name: 'Contacto', element: document.getElementById('contact') }
    ];
    
    // Find which section is currently most visible
    let currentSectionIndex = 0;
    let maxVisibility = 0;
    
    sections.forEach((section, index) => {
        if (section.element) {
            const rect = section.element.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            if (visibleHeight > maxVisibility) {
                maxVisibility = visibleHeight;
                currentSectionIndex = index;
            }
        }
    });
    
    // Calculate next section (loop back to home after contact)
    const nextIndex = (currentSectionIndex + 1) % sections.length;
    const nextSectionData = sections[nextIndex];
    
    // Update the link
    nextSection.href = `#${nextSectionData.id}`;
    
    // Update the text
    scrollText.textContent = nextSectionData.name;
    
    // Update the icon (down arrow for all except home, up arrow for home)
    if (nextSectionData.id === 'home') {
        scrollIcon.innerHTML = '<path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/>';
    } else {
        scrollIcon.innerHTML = '<path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>';
    }
}

// Handle navigation clicks
function handleNavClick(e) {
    const targetId = e.target.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            isScrolling = true;
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                updateNextSection(); // Update next section after navigation
            }, 1000);
        }
    }
}

// Initialize everything when the page is ready
function initializePage() {
    // Add click handlers to navigation links
    const navLinks = document.querySelectorAll('.nav-link, .scroll-indicator');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Initial update of next-section
    updateNextSection();
    
    // Add scroll event listener that updates next-section during scrolling
    let scrollUpdateTimeout;
    window.addEventListener('scroll', function() {
        // Always update next-section during scroll (don't check isScrolling)
        clearTimeout(scrollUpdateTimeout);
        scrollUpdateTimeout = setTimeout(() => {
            updateNextSection();
        }, 50); // Update more frequently
    }, { passive: true });
    
    // Add wheel event listener
    window.addEventListener('wheel', function(e) {
        if (isScrolling) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add resize event listener
    window.addEventListener('resize', updateNextSection);
    
    // Snap to section when scroll ends (but only after a delay)
    let snapTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(() => {
            if (!isScrolling) {
                snapToSection();
            }
        }, 300); // Wait 300ms after scroll stops before snapping
    }, { passive: true });
    
    // Fallback for browsers that don't support scrollend
    window.addEventListener('scrollend', function() {
        if (!isScrolling) {
            snapToSection();
        }
    });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Simple fade-in animation for sections
    const sections = document.querySelectorAll('.section');
    
    const fadeInOptions = {
        threshold: 0.1
    };
    
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, fadeInOptions);
    
    sections.forEach(section => {
        section.classList.add('hidden');
        fadeInObserver.observe(section);
    });
    
    // Add active state to nav items based on scroll position
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Initialize a simple modal for project details if needed
    const projects = document.querySelectorAll('.project');
    
    projects.forEach(project => {
        project.addEventListener('click', () => {
            // Add your modal opening code here if you want to implement it
            console.log(`Project ${project.querySelector('h3').textContent} clicked`);
        });
    });
    
    // Custom cursor trail effect
    createCursorTrail();
    
    // Initialize glitch effects on scroll
    initGlitchOnScroll();
    
    // Initialize archive item interactions
    initArchiveInteractions();
    
    // Initialize modal functionality
    initModal();
    
    // Add noise effect to the background
    animateNoise();
});

// Create a custom cursor trail effect
function createCursorTrail() {
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);
    
    const trailElements = [];
    const numTrailElements = 8;
    
    // Create trail elements
    for (let i = 0; i < numTrailElements; i++) {
        const trailElement = document.createElement('div');
        trailElement.className = 'trail-element';
        trailElement.style.width = `${6 - (i * 0.5)}px`;
        trailElement.style.height = `${6 - (i * 0.5)}px`;
        trailElement.style.opacity = `${1 - (i * 0.1)}`;
        trailElement.style.backgroundColor = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
        cursorTrail.appendChild(trailElement);
        trailElements.push({
            element: trailElement,
            x: 0,
            y: 0
        });
    }
    
    // Store cursor position
    let cursorX = 0;
    let cursorY = 0;
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    // Animation loop for trail elements
    function animateTrail() {
        // Update first trail element position to cursor
        trailElements[0].x = cursorX;
        trailElements[0].y = cursorY;
        
        // Update the rest of the trail elements' positions
        for (let i = 1; i < trailElements.length; i++) {
            const current = trailElements[i];
            const previous = trailElements[i - 1];
            
            // Create a trailing effect by delaying the position
            current.x += (previous.x - current.x) * 0.3;
            current.y += (previous.y - current.y) * 0.3;
        }
        
        // Apply positions to elements
        trailElements.forEach((trailObj, index) => {
            trailObj.element.style.transform = `translate(${trailObj.x}px, ${trailObj.y}px)`;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Initialize glitch effects on scroll
function initGlitchOnScroll() {
    const sections = document.querySelectorAll('section');
    const glitchThreshold = 100; // Pixels from the top of the viewport
    
    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            
            // If section is entering viewport
            if (rect.top <= window.innerHeight - glitchThreshold && rect.bottom >= glitchThreshold) {
                if (!section.classList.contains('glitched')) {
                    section.classList.add('glitched');
                    glitchEffect(section);
                }
            }
        });
    });
}

// Create a temporary glitch effect on an element
function glitchEffect(element) {
    const originalTransform = element.style.transform;
    const originalFilter = element.style.filter;
    
    // Sequence of glitch transformations
    const glitches = [
        { transform: 'translateX(-5px)', filter: 'hue-rotate(90deg)' },
        { transform: 'translateX(5px) skewX(2deg)', filter: 'hue-rotate(-90deg)' },
        { transform: 'translateY(-3px)', filter: 'brightness(1.5)' },
        { transform: 'translateY(3px) skewY(-2deg)', filter: 'contrast(1.5)' },
        { transform: originalTransform, filter: originalFilter }
    ];
    
    // Apply each glitch state briefly
    let i = 0;
    const glitchInterval = setInterval(() => {
        if (i >= glitches.length) {
            clearInterval(glitchInterval);
            element.style.transform = originalTransform;
            element.style.filter = originalFilter;
            return;
        }
        
        element.style.transform = glitches[i].transform;
        element.style.filter = glitches[i].filter;
        i++;
    }, 100);
}

// Initialize archive item interactions
function initArchiveInteractions() {
    const archiveItems = document.querySelectorAll('.archive-item');
    const modal = document.getElementById('dataModal');
    const modalBody = modal.querySelector('.modal-body');
    
    archiveItems.forEach(item => {
        const accessBtn = item.querySelector('.archive-access');
        const title = item.querySelector('h3').textContent;
        
        accessBtn.addEventListener('click', () => {
            // Generate random data for the modal content
            const dataContent = generateRandomDataContent();
            modalBody.innerHTML = `
                <h4>${title}</h4>
                <div class="data-content">${dataContent}</div>
                <div class="data-status">
                    <div class="progress">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="status-text">DECRYPTION IN PROGRESS...</div>
                </div>
            `;
            
            // Show the modal
            modal.style.display = 'flex';
            
            // Animate progress bar
            const progressBar = modalBody.querySelector('.progress-bar');
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 1;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    modalBody.querySelector('.status-text').textContent = 'DECRYPTION COMPLETE';
                }
            }, 50);
            
            // Add glitch effect to the modal
            glitchEffect(modal.querySelector('.modal-content'));
        });
    });
}

// Initialize modal functionality
function initModal() {
    const modal = document.getElementById('dataModal');
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Generate random data content for the modal
function generateRandomDataContent() {
    const lines = [];
    const numLines = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < numLines; i++) {
        const lineLength = Math.floor(Math.random() * 50) + 10;
        let line = '';
        
        for (let j = 0; j < lineLength; j++) {
            if (Math.random() < 0.2) {
                line += '<span class="corrupted">' + String.fromCharCode(Math.floor(Math.random() * 26) + 97) + '</span>';
            } else {
                line += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            }
        }
        
        lines.push(`<p>${line}</p>`);
    }
    
    return lines.join('');
}

// Add a subtle pixel noise animation to the background
function animateNoise() {
    const noiseOverlay = document.querySelector('.noise-overlay');
    let noiseOpacity = 0.05;
    let increasing = true;
    
    setInterval(() => {
        if (increasing) {
            noiseOpacity += 0.005;
            if (noiseOpacity >= 0.1) {
                increasing = false;
            }
        } else {
            noiseOpacity -= 0.005;
            if (noiseOpacity <= 0.02) {
                increasing = true;
            }
        }
        
        noiseOverlay.style.opacity = noiseOpacity;
    }, 100);
}

// Add these styles to the document for cursor trail
const style = document.createElement('style');
style.textContent = `
    .cursor-trail {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
    }
    
    .trail-element {
        position: absolute;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s;
        mix-blend-mode: screen;
        box-shadow: 0 0 10px currentColor;
    }
    
    .data-content {
        font-family: 'VT323', monospace;
        color: var(--terminal-green);
        margin-bottom: 1.5rem;
    }
    
    .corrupted {
        color: var(--primary);
        text-shadow: 0 0 5px var(--primary);
    }
    
    .data-status {
        margin-top: 1.5rem;
    }
    
    .progress {
        height: 10px;
        background-color: rgba(255, 255, 255, 0.1);
        margin-bottom: 0.5rem;
        border-radius: 5px;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        width: 0;
        background: linear-gradient(to right, var(--secondary), var(--primary));
        border-radius: 5px;
        transition: width 0.1s linear;
    }
    
    .status-text {
        font-size: 0.9rem;
        color: var(--accent);
    }
    
    .glitched {
        transition: transform 0.2s, filter 0.2s;
    }
`;

document.head.appendChild(style); 
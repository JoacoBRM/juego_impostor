// Crear partículas flotantes
function createParticles() {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posición aleatoria horizontal
        particle.style.left = Math.random() * 100 + '%';
        
        // Tamaño aleatorio
        const size = Math.random() * 5 + 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Retraso aleatorio en la animación
        particle.style.animationDelay = Math.random() * 15 + 's';
        
        // Duración aleatoria
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        document.body.appendChild(particle);
    }
}

// Efecto de seguimiento del cursor
function createCursorEffect() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 215, 0, 0.8);
        border-radius: 50%;
        pointer-events: none;
        transition: transform 0.15s ease;
        z-index: 9999;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Efecto al hacer click
    document.addEventListener('click', (e) => {
        cursor.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cursor.style.transform = 'scale(1)';
        }, 200);
        
        // Crear efecto de onda en el click
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX - 25}px;
            top: ${e.clientY - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid rgba(255, 215, 0, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
            z-index: 9998;
        `;
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// Agregar animación CSS para el efecto ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Animación de entrada para las secciones
function observeSections() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Efecto de texto brillante en el título
function addTitleGlow() {
    const title = document.querySelector('header h1');
    if (title) {
        setInterval(() => {
            title.style.textShadow = `
                0 0 10px rgba(233, 69, 96, ${Math.random() * 0.5 + 0.5}),
                0 0 20px rgba(233, 69, 96, ${Math.random() * 0.3 + 0.3}),
                0 0 30px rgba(233, 69, 96, ${Math.random() * 0.2 + 0.2}),
                3px 3px 6px rgba(0, 0, 0, 0.5)
            `;
        }, 100);
    }
}

// Inicializar todas las animaciones cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    observeSections();
    addTitleGlow();
    // El efecto de cursor puede ser algo pesado, lo comento para priorizar la fluidez.
    // Si deseas mantenerlo, simplemente descomenta la siguiente línea.
    // createCursorEffect();
});

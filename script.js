window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }, 800);
    
    createStars();
});

function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDuration = (Math.random() * 3 + 1) + 's';
        star.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(star);
    }
}

const btn = document.getElementById('blow-btn');
const cake = document.getElementById('cake');
const wishText = document.getElementById('wish-text');

btn.addEventListener('click', function() {
    cake.classList.add('blown');
    
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';
    btn.style.position = 'absolute';
    
    wishText.classList.add('show');
    
    fireConfetti();
    
    setTimeout(() => {
        const content = document.getElementById('main-content');
        content.scrollIntoView({ behavior: 'smooth' });
    }, 2500);
});

function fireConfetti() {
    const colors = ['#ffb6c1', '#ffd700', '#fff5f7', '#c8709a'];
    const amount = 150;
    
    for(let i = 0; i < amount; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti-piece';
        
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.left = Math.random() * 100 + 'vw';
        
        if (Math.random() > 0.5) {
            conf.style.borderRadius = '50%';
            conf.style.width = '8px';
            conf.style.height = '8px';
        }
        
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        conf.style.animationDuration = duration + 's';
        conf.style.animationDelay = delay + 's';
        
        document.body.appendChild(conf);
        
        setTimeout(() => {
            conf.remove();
        }, (duration + delay) * 1000);
    }
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            if(entry.target.tagName === 'H2') {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.observer-item').forEach(item => {
    observer.observe(item);
});

const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalText = document.getElementById('modal-text');
const closeModalBtn = document.getElementById('close-modal');

document.querySelectorAll('.polaroid-item').forEach(item => {
    item.addEventListener('click', () => {
        const imgElement = item.querySelector('img');
        const message = item.getAttribute('data-message');
        
        modalImg.src = imgElement.src;
        modalText.textContent = message;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
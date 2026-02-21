class LottoDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['numbers'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'numbers') {
            this.render();
        }
    }

    render() {
        const numbers = this.getAttribute('numbers')?.split(',') || [];
        const style = `
            .lotto-display {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin: 20px 0;
            }
            .lotto-number {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: var(--number-bg, #fff);
                color: var(--number-text, #333);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s, color 0.3s;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="lotto-display">
                ${numbers.map(num => `<div class="lotto-number">${num}</div>`).join('')}
            </div>
        `;
    }
}

customElements.define('lotto-display', LottoDisplay);

function generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

// Lotto display update
function updateLottoDisplay() {
    const lottoDisplay = document.querySelector('.lotto-display');
    const existingLotto = lottoDisplay.querySelector('lotto-display');
    const numbers = generateNumbers().join(',');
    
    if (existingLotto) {
        existingLotto.setAttribute('numbers', numbers);
    } else {
        const newDisplay = document.createElement('lotto-display');
        newDisplay.setAttribute('numbers', numbers);
        lottoDisplay.appendChild(newDisplay);
    }
}

document.getElementById('generate').addEventListener('click', updateLottoDisplay);

// Theme toggle logic
const themeButton = document.getElementById('theme-button');
const body = document.body;

function setTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        themeButton.textContent = '라이트 모드';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        themeButton.textContent = '다크 모드';
        localStorage.setItem('theme', 'light');
    }
}

// Initial theme setup
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setTheme(true);
}

themeButton.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-mode');
    setTheme(!isDark);
});

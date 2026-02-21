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
                background-color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

document.getElementById('generate').addEventListener('click', () => {
    const lottoDisplay = document.querySelector('.lotto-display');
    const newDisplay = document.createElement('lotto-display');
    newDisplay.setAttribute('numbers', generateNumbers().join(','));
    lottoDisplay.replaceWith(newDisplay);
});

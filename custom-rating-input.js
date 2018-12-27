const range = (min, max) => {
    const result = [];
    for (let i = min; i <= max; i++) {
        result.push(i);
    }
    return result;
};

const clamp = (x, min, max) =>
    Math.max(Math.min(x, max), min)


class RatingInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(
            RatingInput.template.content.cloneNode(true));
    }

    get value() {
        return this.ratingInput.value;
    }

    set value(newValue) {
        this.ratingInput.value = clamp(newValue, 1, this.max);
        this.stars.forEach((star, index) => this.setStarChecked(star, index));
    }

    get max() {
        return this.ratingInput.max;
    }

    set max(max) {
        if (max !== this.ratingInput.max) {
            this.ratingInput.max = max;
            this.stars.forEach(star => star.parentNode.removeChild(star));
            this.addStars();
        }
    }

    getAttribute(attributeName) {
        return this.ratingInput.getAttribute(attributeName);
    }

    setAttribute(attributeName, value) {
        if (attributeName === 'value') {
            this.value = value;
        } else {
            this.ratingInput.setAttribute(attributeName, value);
        }
    }

    removeAttribute(attributeName) {
        return this.ratingInput.removeAttribute(attributeName);
    }

    connectedCallback() {
        this.addInput();
        this.copyAttributesToInput();
        this.addStars();
        this.max = this.max || 5;
        this.value = this.value || 1;
    }

    addInput() {
        this.ratingInput = document.createElement('input');
        this.ratingInput.setAttribute('type', 'hidden');
        this.shadowRoot.appendChild(this.ratingInput);
    }

    addStars() {
        this.stars = range(1, this.max).map(num => {
            const star = document.createElement('i');
            star.tabIndex = '0';
            star.classList.add('rating-input--star');
            this.setStarChecked(star, num - 1);
            star.addEventListener('click', () => this.value = num);
            star.addEventListener('keydown', event => this.handleStarKeyDown(event, num));
            this.shadowRoot.appendChild(star);
            return star;
        });
    }

    handleStarKeyDown(event, num) {
        if (!event.altKey && event.key === ' ') {
            this.value = num;
        }
    }

    copyAttributesToInput() {
        for (let attribute of this.attributes) {
            this.ratingInput.setAttribute(attribute.name, attribute.value);
        }
    }

    setStarChecked(star, index) {
        if (index < this.value) {
            star.classList.add('checked');
        } else {
            star.classList.remove('checked');
        }

    }
}

RatingInput.template = document.createElement('template');
RatingInput.template.innerHTML = `
<style>
  :host {
      display: inline-block;
      border-radius: var(--container-border-radius, 3px);
      padding: var(--container-padding, .25rem);
      box-shadow: var(--container-box-shadow);
  }

  .rating-input--star {
    display: inline-block;
    background: var(--box-unchecked-background, rgba(0, 0, 255, .5));
    width: var(--box-size, 2rem);
    height: var(--box-size, 2rem);
    margin: var(--box-margin, .4rem);
    border-radius: var(--box-border-radius, 10px);
    box-shadow: var(--box-box-shadow);
  }

  .rating-input--star.checked{
    background: var(--box-checked-background, yellow);
  }
</style>
<slot></slot>`;

customElements.define('rating-input', RatingInput);


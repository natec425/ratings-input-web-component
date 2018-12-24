const range = (min, max) => {
    const result = [];
    for (let i = min; i <= max; i++) {
        result.push(i);
    }
    return result;
};

class RatingInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(
            RatingInput.template.content.cloneNode(true));
        this.maxRating = this.getAttribute('max-rating') || 5;
    }

    get value() {
        return this.ratingInput.value;
    }

    set value(newValue) {
        this.updateValue(newValue);
    }

    getAttribute(attributeName) {
        if (RatingInput.hostAttributes.includes(attributeName)) {
            return super.getAttribute(attributeName);
        } else {
            return this.ratingInput.getAttribute(attributeName);
        }
    }

    setAttribute(attributeName, value) {
        if (attributeName === 'value') {
            this.updateValue(value);
        }
        if (RatingInput.hostAttributes.includes(attributeName)) {
            return super.setAttribute(attributeName, value);
        } else {
            return this.ratingInput.setAttribute(attributeName, value);
        }
    }

    removeAttribute(attributeName, value) {
        if (RatingInput.hostAttributes.includes(attributeName)) {
            return super.removeAttribute(attributeName, value);
        } else {
            return this.ratingInput.removeAttribute(attributeName, value);
        }
    }

    connectedCallback() {
        this.addChildren();
        this.copyAttributesToInput();
        this.updateValue(this.getAttribute('value') || 1);
    }

    addChildren() {
        this.addInput();
        this.addStars();
    }

    addInput() {
        this.ratingInput = document.createElement('input');
        this.ratingInput.setAttribute('type', 'hidden');
        this.shadowRoot.appendChild(this.ratingInput);
    }

    addStars() {
        this.stars = range(1, this.maxRating).map(num => {
            const star = document.createElement('i');
            star.classList.add('rating-input--star');
            star.addEventListener('click', () => this.updateValue(num));
            this.shadowRoot.appendChild(star);
            return star;
        });
    }

    updateValue(num) {
        this.ratingInput.value = Math.min(num, this.maxRating);
        this.stars.forEach((star, index) => {
            if (index < num) {
                star.classList.add('checked');
            } else {
                star.classList.remove('checked');
            }
        });
    }

    copyAttributesToInput() {
        for (let attribute of this.attributes) {
            this.ratingInput.setAttribute(attribute.name, attribute.value);
        }
    }
}

RatingInput.hostAttributes = ['raised', 'max-rating'];
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


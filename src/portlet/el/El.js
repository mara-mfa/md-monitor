export default class El {
  static use(domElement) {
    let el = new El()
    el.domEl = domElement
    return el
  }

  static clear(domElement) {
    let el = new El()
    el.domEl = domElement
    el.txt('')
    return el
  }

  static cr(tagName) {
    let el = new El();
    el.domEl = document.createElement(tagName)
    return el;
  }

  cls(className) {
    this.domEl.className = className;
    return this;
  }

  txt(content) {
    this.domEl.innerText = content;
    return this;
  }

  width(value) {
    this.domEl.style.width = value
    return this
  }

  attr(attributeName, value) {
    this.domEl.setAttribute(attributeName, value)
    return this
  }


  onClick(handler) {
    this.domEl.addEventListener('click', handler);
    return this;
  }

  $ap(element) {
    if (element.constructor.name === 'El') {
      this.domEl.appendChild(element.getElement())
    } else {
      this.domEl.appendChild(element)
    }
  }

  $renderTo(element) {
    if (element.constructor.name === 'El') {
      element.$ap(element)
    } else {
      element.appendChild(this.domEl)
    }

    return this
  }

  getElement() {
    return this.domEl;
  }

}

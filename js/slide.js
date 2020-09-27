export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.distancia = {
      posicaoFinal: 0,
      startX: 0,
      movimento: 0,
    };
  }

  moveSlide(distX) {
    this.distancia.savePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.distancia.movimento = (this.distancia.startX - clientX) * 1.6;
    return this.distancia.posicaoFinal - this.distancia.movimento;
  }

  onStart(event) {
    event.preventDefault();
    this.distancia.startX = event.clientX;
    this.wrapper.addEventListener('mousemove', this.onMove);
  }

  onMove(event) {
    const posicaoFinal = this.updatePosition(event.clientX);
    this.moveSlide(posicaoFinal);
  }

  onEnd(event) {
    this.wrapper.removeEventListener('mousemove', this.onMove);
    this.distancia.posicaoFinal = this.distancia.savePosition;
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
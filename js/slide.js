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
    let moveType;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.distancia.startX = event.clientX;
      moveType = 'mousemove';
    } else {
      this.distancia.startX = event.changedTouches[0].clientX;
      moveType = 'touchmove';
    }
    this.wrapper.addEventListener(moveType, this.onMove);
  }

  onMove(event) {
    const clientX = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const posicaoFinal = this.updatePosition(clientX);
    this.moveSlide(posicaoFinal);
  }

  onEnd(event) {
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.distancia.posicaoFinal = this.distancia.savePosition;
    this.chandeSlideOnEnd();
  }

  chandeSlideOnEnd() {
    if (this.distancia.movimento > 120) {
      this.activeNextSlide();
    } else if (this.distancia.movimento < -120) {
      this.activePrevSlide();
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  slidePosition(slide) {
    const margem = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margem);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const posicao = this.slidePosition(element);
      return { element, posicao }
    });
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    }
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.posicao);
    this.slideIndexNav(index);
    this.distancia.posicaoFinal = activeSlide.posicao;
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev)
  }

  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next)
  }

  init() {
    this.bindEvents();
    this.slidesConfig();
    this.changeSlide(1);
    this.addSlideEvents();
    return this;
  }
}
import template from './Main.template.html';

class Main {

  constructor() {

  }

  $onInit() {

  }

  setData(event) {
    console.debug('setData ', event);
    this.minValue = event.minValue;
    this.maxValue = event.maxValue;
    this.minHandleLeftPos = event.minHandleLeftPos;
    this.maxHandleLeftPos = event.maxHandleLeftPos;
  }

}

export default {
  controller: Main,
  template
};

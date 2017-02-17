import angular from 'angular';
import template from './RangeSlider.template.html';

const HANDLE_WIDTH = 25;

class RangeSlider {

  static get $inject() {
    return ['$element', '$document', '$timeout'];
  }

  constructor($element, $document, $timeout) {
    this.$element = $element;
    this.$document = $document;
    this.$timeout = $timeout;
  }

  $onInit() {
    console.debug('RangeSlider onInit ', angular.element(this.$element));
    const container = angular.element(this.$element).children()[0];
    const track = angular.element(angular.element(container).find('div')[0]);
    track.css({width: this.width + 'px'});
    angular.element(container).css({width: this.width + 50 + 'px'});
    this.trackWidth = this.width;
    this.trackLeftPos = track[0].getBoundingClientRect().left;
    this.isDragging = false;
    this.minValue = this.minDefaultValue;
    this.maxValue = this.maxDefaultValue;
    this.setMinHandlePosition();
    this.setMaxHandlePosition();
    this.setRangeLeftPosition();
    this.setRangeWidth();
    console.debug('track width ', this.trackWidth);
    console.debug('trackLeftPos ', this.trackLeftPos);
    console.debug('minHandleLeftPos ', this.minHandleLeftPos);
    console.debug('maxHandleLeftPos ', this.maxHandleLeftPos);
    this.$document.on('mousemove', this.moveHandle.bind(this));
    this.$document.on('mouseup', this.dragEnd.bind(this));
  }

  $onChanges(changes) {
    if (changes.minDefaultValue) {
      this.minValue = angular.copy(changes.minDefaultValue.currentValue);
    }

    if (changes.maxDefaultValue) {
      this.maxValue = angular.copy(changes.maxDefaultValue.currentValue);
    }

    if (changes.minLimit) {
      this.minLimit = angular.copy(changes.minLimit.currentValue);
    }

    if (changes.maxLimit) {
      this.maxLimit = angular.copy(changes.maxLimit.currentValue);
    }

    if (changes.width) {
      this.trackWidth = angular.copy(changes.width.currentValue);
    }

  }

  // notify parent
  updateParent() {
    this.onUpdate({
      $event: {
        minValue: this.minValue,
        maxValue: this.maxValue,
        minHandleLeftPos: this.minHandleLeftPos,
        maxHandleLeftPos: this.maxHandleLeftPos
      }
    });
  }

  dragStart(event) {
    console.debug('dragStart ', event.target.className);
    this.isDragging = true;
    this.elementToMove = event.target.className;
  }

  dragEnd(event) {
    console.debug('dragEnd ', event.target.className);
    this.isDragging = false;
  }

  moveHandle(event) {
    if (this.isDragging) {
      console.debug('moveHandle ', this.elementToMove);
      switch (this.elementToMove) {
        case 'handle handle-min':
          console.debug('case handle handle-min');
          this.$timeout(() => {
            console.debug('this.isMinHandlePositionValid() ', this.isMinHandlePositionValid(event));
            if (this.isMinHandlePositionValid(event)) {
              this.setMinHandlePositionFromMousePosition(event);
              this.setMinValue();
              this.setRangeLeftPosition();
              this.setRangeWidth();
              this.updateParent();
            }
          });
          break;
        case 'handle handle-max':
          console.debug('case handle handle-max');
          this.$timeout(() => {
            console.debug('this.isMaxHandlePositionValid() ', this.isMaxHandlePositionValid(event));
            if (this.isMaxHandlePositionValid(event)) {
              this.setMaxHandlePositionFromMousePosition(event);
              this.setMaxValue();
              this.setRangeLeftPosition();
              this.setRangeWidth();
              this.updateParent();
            }
          });
          break;
        default:
      }
    }
  }

  getHandlePositionFromMousePosition(event) {
    console.debug('getHandlePositionFromMousePosition ', event.clientX);
    return event.clientX - this.trackLeftPos - HANDLE_WIDTH;
  }

  setMinHandlePositionFromMousePosition(event) {
    this.minHandleLeftPos = event.clientX - this.trackLeftPos - HANDLE_WIDTH;
  }

  setMaxHandlePositionFromMousePosition(event) {
    this.maxHandleLeftPos = event.clientX - this.trackLeftPos - HANDLE_WIDTH;
  }

  setMinValue() {
    this.minValue = Math.floor( ( ( this.minHandleLeftPos ) * this.maxLimit ) / ( this.trackWidth - ( HANDLE_WIDTH * 2 ) ) );
    console.debug('setMinValue ', this.minValue);
  }

  setMaxValue() {
    this.maxValue = Math.floor( ( ( this.maxHandleLeftPos - HANDLE_WIDTH ) * this.maxLimit ) / ( this.trackWidth - ( HANDLE_WIDTH * 2 ) ) );
    console.debug('setMaxValue ', this.maxValue);
  }

  setRangeLeftPosition() {
    this.rangeLeftPos = this.minHandleLeftPos + HANDLE_WIDTH;
  }

  setRangeWidth() {
    this.rangeWidth = this.maxHandleLeftPos - this.minHandleLeftPos - HANDLE_WIDTH;
  }

  setMinHandlePosition() {
    this.minHandleLeftPos = ( this.minValue / this.maxLimit ) * ( this.trackWidth - HANDLE_WIDTH );
  }

  setMaxHandlePosition() {
    this.maxHandleLeftPos = ( this.maxValue / this.maxLimit ) * ( this.trackWidth ) - ( HANDLE_WIDTH / 2 );
  }

  isMinHandlePositionValid(event) {
    //console.debug('isMinHandlePositionValid ', event);
    const minValue = Math.floor( ( ( this.getHandlePositionFromMousePosition(event) ) * this.maxLimit) / ( this.trackWidth - ( HANDLE_WIDTH * 2 ) ) );
    console.debug('isMinHandlePositionValid minValue ', minValue);
    const isMinLimitValid = minValue > this.minLimit || minValue === this.minLimit;
    const isMaxLimitValid = minValue < this.maxValue;
    return isMinLimitValid && isMaxLimitValid;
  }

  isMaxHandlePositionValid(event) {
    //console.debug('isMaxHandlePositionValid ', event);
    const maxValue = Math.floor( ( ( this.getHandlePositionFromMousePosition(event) - HANDLE_WIDTH ) * this.maxLimit ) / ( this.trackWidth - ( HANDLE_WIDTH * 2 ) ) );
    const isMaxLimitValid = maxValue < this.maxLimit || maxValue === this.maxLimit;
    const isMinLimitValid = maxValue > this.minValue;
    return isMinLimitValid && isMaxLimitValid;
  }

}

export default {
  bindings: {
    width: '<',
    minLimit: '<',
    maxLimit: '<',
    minDefaultValue: '<',
    maxDefaultValue: '<',
    onUpdate: '&'
  },
  controller: RangeSlider,
  template
};
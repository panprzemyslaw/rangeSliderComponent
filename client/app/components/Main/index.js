import angular from 'angular';
import rangeSliderModule from '../RangeSlider'
import mainComponent from './Main.component';

export default angular.module('main', [rangeSliderModule.name])
  .component('main', mainComponent);
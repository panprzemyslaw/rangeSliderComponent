import angular from 'angular';
import uiRouter from 'angular-ui-router';
import MainModule from './components/Main/';
import './app.scss';

angular.module('app', [
    uiRouter,
    MainModule.name
  ])
  .config(($locationProvider) => {
    "ngInject";
    $locationProvider.html5Mode(true).hashPrefix('!');
  });

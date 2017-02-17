import rangeSliderModule from './';

describe('RangeSlider component', function() {

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(rangeSliderModule.name);

    angular.mock.inject(function($injector) {
      this.$componentController = $injector.get('$componentController');
      this.$rootScope = $injector.get('$rootScope');
      this.$timeout = $injector.get('$timeout');
      this.$compile = $injector.get('$compile');
      this.$document = $injector.get('$document');
      this.outerScope = this.$rootScope.$new();
      this.template = `
      <range-slider
        width="350"
        min-limit="0"
        max-limit="100"
        min-default-value="20"
        max-default-value="80"
        on-update="$ctrl.setData($event)">
        </range-slider>
      `;

      this.createController = (bindings) => {
        this.element = this.getCompiledElement();
        const deps = {$element: this.element, $document: this.$document, $timeout: this.$timeout};
        const ctrl = this.$componentController('rangeSlider', deps, bindings);
        ctrl.$onInit();
        return ctrl;
      };

      this.getCompiledElement = () => {
        const elem = angular.element(this.template);
        const compiledElem = this.$compile(elem)(this.outerScope);
        this.outerScope.$digest();
        return compiledElem;
      };

    });
  });

  describe('given rangeSlider', function() {

    describe('when minDefaultValue is changed', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ minDefaultValue: 20 });
        this.changes = { minDefaultValue: {} };

        this.changes.minDefaultValue.currentValue = 30;
        this.ctrl.$onChanges(this.changes);
      });

      it('should update minValue', function() {
        expect(this.ctrl.minValue).toEqual(this.changes.minDefaultValue.currentValue);
      });

    });

    describe('when maxDefaultValue is changed', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ maxDefaultValue: 80 });
        this.changes = { maxDefaultValue: {} };

        this.changes.maxDefaultValue.currentValue = 90;
        this.ctrl.$onChanges(this.changes);
      });

      it('should update maxValue', function() {
        expect(this.ctrl.maxValue).toEqual(this.changes.maxDefaultValue.currentValue);
      });

    });

    describe('when minLimit is changed', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ minLimit: 0 });
        this.changes = { minLimit: {} };

        this.changes.minLimit.currentValue = 10;
        this.ctrl.$onChanges(this.changes);
      });

      it('should update minLimit property', function() {
        expect(this.ctrl.minLimit).toEqual(this.changes.minLimit.currentValue);
      });

    });

    describe('when maxLimit is changed', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ maxLimit: 90 });
        this.changes = { maxLimit: {} };

        this.changes.maxLimit.currentValue = 100;
        this.ctrl.$onChanges(this.changes);
      });

      it('should update maxLimit property', function() {
        expect(this.ctrl.maxLimit).toEqual(this.changes.maxLimit.currentValue);
      });

    });

    describe('when width is changed', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ width: 300 });
        this.changes = { width: {} };

        this.changes.width.currentValue = 100;
        this.ctrl.$onChanges(this.changes);
      });

      it('should update trackWidth property', function() {
        expect(this.ctrl.trackWidth).toEqual(this.changes.width.currentValue);
      });

    });

    describe('when updateParent is called', function() {

      beforeEach(function() {
        this.onUpdateSpy = jasmine.createSpy('onUpdate');
        this.ctrl = this.createController({
          minLimit: 0,
          maxLimit: 90,
          minDefaultValue: 20,
          maxDefaultValue: 80,
          onUpdate: this.onUpdateSpy
        });

        this.ctrl.updateParent();

      });

      it('should call onUpdate method', function() {
        expect(this.onUpdateSpy).toHaveBeenCalled();
      });

    });

    describe('onMouseDown and onMouseMove on slider minHandle', function() {

      beforeEach(function() {

        this.ctrl = this.createController({
          width: 350,
          minLimit: 0,
          maxLimit: 100,
          minDefaultValue: 20,
          maxDefaultValue: 80
        });

        const container = angular.element(this.element).children()[0];
        const track = angular.element(angular.element(container).find('div')[0]);
        this.leftHandle = angular.element(angular.element(track).find('div')[0]);
        this.leftHandleMin = angular.element(angular.element(this.leftHandle).find('div')[0]);
        console.debug('this.leftHandle left ', this.leftHandle.css('left'));
        //Handle position formula is:
        //event.clientX - this.trackLeftPos - HANDLE_WIDTH
        //initial this.trackLeftPos = 65, HANDLE_WIDTH = 25 therefore initial event.clientX = 90
        this.leftHandleMin.triggerHandler({type: 'mousedown', clientX: 90, clientY: 0});
        this.$document.triggerHandler({type: 'mousemove', clientX: 120, clientY: 20});
        this.$timeout.flush();
      });

      it('should move the minHandle of the slider', function() {
        //we are moving mouse from 90 to 120 and we expect handle to move from 65 to 95
        expect(this.leftHandle.css('left')).toBe('95px');
      });

    });

  });

});
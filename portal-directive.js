(function (angular, _, $) {
	'use strict';

	angular.module('battlesnake.portal')
		.directive('portal', portalDirective);
	
	/**
	 * @ngdoc directive
	 * @name portal
	 */
	function portalDirective($compile) {
		/* Auto-increment */
		var portalId = 0;

		var elements = {};
		/* Widget */
		elements.widget = angular.element('<div/>')
			.attr('widget', 'widget');
		/* Widget areas */
		elements.areas = angular.element('<div/>')
			.addClass('portal-area')
			.attr({
				'ng-repeat': '(index, area) in areas',
				'ng-model': 'widgetsByArea[index]',
				'ng-class': '(area.class||"") + " " +  sortableClass'
				'ui-sortable': 'sortableOptions'
			})
			.append(elements.widget.clone()
				.attr({ 'ng-repeat': 'widget in area.widgets' })
			);

		return {
			restrict: 'EA',
			require: ['portal'],
			scope: {
				areas: '=areas',
				widgets: '=widgets',
				editing: '@'
			},
			controller: 'portalController',
			compile: compile
		}

		function compile(element, attrs) {
			element.addClass('portal');
			element.append(elements.areas.clone());
			return link;
		}

		function link(scope, element, attrs, controllers) {
			var portalController = controllers[0];
			scope.sortableClass = 'portal-' + (++portalId) + '-area';
			scope.sortableOptions = {
				placeholder: 'portal-placeholder',
				connectWith: scope.sortableClass
			};
			scope.$watch('areas', areasChanged);
			scope.$watch('widgets', widgetsChanged);
			scope.$watch('editing', editingChanged);
			return;

			function areasChanged(areas) {
				regroupWidgets();
			}

			function widgetsChanged(widgets) {
				regroupWidgets();
			}

			function regroupWidgets() {
				scope.widgetsByArea = _(scope.widgets).groupBy('areaIndex');
			}

			/* Enable/disable editor */
			function editingChanged(editing) {
				if (editing) {
					element.addClass('editing');
				} else {
					element.removeClass('editing');
				}
			}
		}
	}

})(window.angular, window._, window.$);

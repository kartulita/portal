(function (angular, _, $) {
	'use strict';

	angular.module('battlesnake.portal')
		.directive('widget', widgetDirective);
	
	/**
	 * @ngdoc directive
	 * @name widget
	 */
	function widgetDirective($compile) {
		/* Auto-increment */
		var portalId = 0;

		return {
			restrict: 'EA',
			require: ['^portal'],
			scope: {
				'widget': '='
			},
			compile: compile
		}

		function compile(element, attrs) {
			element
				.addClass('widget-container')
				.append(angular.element('<div/>')
					.addClass('widget')
				);
			return link;
		}

		function link(scope, element, attrs, controllers) {
			scope.$watch('widget', widgetChanged);
			return;

			function widgetChanged(widget) {
				var targetElement = element.find('.widget');
				var widgetElement = $compile(widget.html)(scope.$new(true));
				targetElement
					.empty()
					.append(widgetElement);
			}
		}

	}

})(window.angular, window._, window.$);

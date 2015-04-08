(function (angular) {
	'use strict';

	angular.module('battlesnake.portal')
		.directive('widget', widgetDirective);
	
	/**
	 * @ngdoc directive
	 * @name widget
	 */
	function widgetDirective($compile) {
		return {
			restrict: 'A',
			scope: {
				'widget': '=',
				'editing': '=',
				'onconfigure': '&',
				'onremove': '&'
			},
			templateUrl: 'widget-template.html',
			link: link
		}

		function link(scope, element, attrs) {
			scope.configure = configure;
			scope.remove = remove;

			scope.$watch('widget', widgetChanged, true);
			return;

			function configure() {
				scope.onconfigure({ widget: scope.widget });
			}

			function remove() {
				scope.onremove({ widget: scope.widget });
			}

			function widgetChanged(widget) {
				var targetElement = element.find('.widget');
				var widgetElement = $compile(widget.html)(scope.$parent.widgetParentScope);
				targetElement
					.empty()
					.append(widgetElement);
			}
		}

	}

})(window.angular);

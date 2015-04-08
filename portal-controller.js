(function (angular) {
	'use strict';

	angular.module('battlesnake.portal')
		.controller('portalController', portalController);
	
	/**
	 * @ngdoc directive
	 * @name portal
	 */
	function portalController($scope, $q) {
		var scope = $scope;
		var element;
		scope.configure = configure;
		scope.remove = remove;
		scope.add = add;
		scope.changed = changed;
		scope.validate = validate;

		this.init = initController;
		return;

		function initController(element_) {
			element = element_;
		}

		/* Remove a widget */
		function remove(area, widget) {
			$q.when(scope.onremove({ area: area, widget: widget }))
				.then(function doRemove() {
					var index = area.widgets.indexOf(widget);
					area.widgets.splice(index, 1);
				});
		}

		/* Configure a widget */
		function configure(widget) {
			scope.onconfigure({ widget: widget });
		}

		/* Add widget */
		function add(area) {
			scope.onadd({ area: area });
		}

		/* Arrangement changed */
		function changed() {
			scope.onchange({});
		}

		/* Validate re-arrangement */
		function validate(widget, source, target) {
			return scope.onmove({ widget: widget, source: source, target: target });
		}

	}

})(window.angular);

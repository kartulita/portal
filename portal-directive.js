(function (angular) {
	'use strict';

	angular.module('battlesnake.portal')
		.directive('portal', portalDirective);
	
	/**
	 * @ngdoc directive
	 * @name portal
	 */
	function portalDirective() {
		/* Auto-increment */
		var portalId = 0;

		return {
			restrict: 'EA',
			require: 'portal',
			controller: 'portalController',
			scope: {
				areas: '=',
				editing: '=',
				onmove: '&',
				onchange: '&',
				onconfigure: '&',
				onadd: '&',
				onremove: '&'
			},
			templateUrl: 'portal-template.html',
			compile: compile
		}

		function compile(element, attrs) {
			element.addClass('portal');
			return link;
		}

		function link(scope, element, attrs, controller) {
			var id = ++portalId;
			var areaClass = 'portal-' + id + '-area';
			scope.sortableClass = areaClass;
			var areaSelector = '.' + areaClass;
			scope.sortableOptions = {
				cursor: 'move',
				disabled: true,
				scroll: true,
				dropOnEmpty: true,
				items: '>li',
				tolerance: 'pointer',
				placeholder: 'portal-placeholder',
				forcePlaceholderSize: true,
				revert: 200,
				connectWith: areaSelector,
				start: dragStart,
				update: dragUpdate,
				stop: dragStop
			};
			scope.widgetParentScope = scope.$parent;

			var changed = false;

			scope.$watch('editing', editingChanged);

			controller.init(element);

			return;

			/* Enable/disable editor */
			function editingChanged(editing) {
				if (editing) {
					element.addClass('editing');
				} else {
					element.removeClass('editing');
				}
				element.find(areaSelector).sortable(editing ? 'enable' : 'disable');
			}

			/* Set inner height of placeholder to match height of widget */
			function dragStart(event, ui) {
				ui.placeholder.height(ui.item.outerHeight());
			}

			/* Validate target */
			function dragUpdate(event, ui) {
				var itemScope = ui.item.scope();
				var areaScope = ui.item.sortable.droptarget.scope();
				if (!itemScope || !areaScope) {
					return;
				}
				var widget = itemScope.widget;
				var source = itemScope.$parent.area;
				var target = areaScope.area;
				/* Validate move */
				if (scope.validate(widget, source, target)) {
					changed = true;
				} else {
					ui.item.sortable.cancel();
				}
			}

			/* Trigger change event if needed */
			function dragStop(event, ui) {
				if (changed) {
					scope.changed();
					changed = false;
				}
			}

		}
	}

})(window.angular);

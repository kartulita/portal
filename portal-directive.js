(function (angular) {
	'use strict';

	angular.module('battlesnake.portal')
		.directive('portal', portalDirective);
	
	/**
	 * @ngdoc directive
	 * @name portal
	 */
	function portalDirective($q, portalTemplate) {
		/* Auto-increment */
		var portalId = 0;

		return {
			restrict: 'EA',
			scope: {
				areas: '=',
				editing: '=',
				onmove: '&',
				onchange: '&',
				onconfigure: '&',
				onadd: '&',
				onremove: '&'
			},
			template: portalTemplate,
			compile: compile
		}

		function compile(element, attrs) {
			element.addClass('portal');
			return link;
		}

		function link(scope, element, attrs) {
			var id = ++portalId;
			var areaClass = 'portal-' + id + '-area';
			var areaSelector = '.' + areaClass;
			scope.configure = configure;
			scope.remove = remove;
			scope.add = add;
			scope.sortableClass = areaClass;
			/* jQuery UI sortable options */
			scope.sortableOptions = {
				'ui-floating': false,
				cursor: 'move',
				disabled: true,
				scroll: true,
				dropOnEmpty: true,
				items: '>li',
				tolerance: 'pointer',
				placeholder: 'portal-placeholder',
				connectWith: areaSelector,
				start: dragStart,
				update: dragUpdate,
				stop: dragStop
			};
			scope.$watch('editing', editingChanged);

			var changed = false;

			return;

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
				if (scope.onmove({ widget: widget, source: source, target: target })) {
					changed = true;
				} else {
					ui.item.sortable.cancel();
				}
			}

			/* Trigger change event if needed */
			function dragStop(event, ui) {
				if (changed) {
					scope.onchange({});
					changed = false;
				}
			}

		}
	}

})(window.angular);

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

		var elements = {};
		/* Widget container (requires ngModel) */
		elements.widgets = angular.element('div')
			.attr({
				'ng-class': 'sortableClass'
				'ui-sortable': 'sortableOptions',
			});
		/* Widget */
		elements.widget = angular.element('div')
			.addClass('widget')
			.attr({ 'ng-bind-html': 'widget.html' });
		/* Column for column layout */
		elements.column = elements.widgets.clone()
			.addClass('portal-column')
			.attr({ 'ng-model': 'byColumn[columnIndex]' })
			.appendChild(elements.widget.clone()
				.attr({ 'ng-repeat': 'widget in byColumn[columnIndex]' })
			);
		/* Column container for column layout */
		elements.columns = angular.element('div')
			.addClass('portal portal-columns editor')
			.attr({ 'ng-repeat': 'columnIndex in columnIndices' })
			.appendChild(elements.column);
		/* Container for fluid layout */
		elements.fluid = elements.widgets.clone()
			.addClass('portal portal-fluid')
			.attr({ 'ng-model': 'all' })
			.appendChild(elements.widget.clone()
				.attr({ 'ng-repeat': 'widget in all' })
			);

		return {
			restrict: 'EA',
			require: ['portal'],
			scope: {
				columnCount: '=columns',
				all: '=widgets'
			},
			controller: 'portalController',
			compile: compile
		}

		function compile(element, attrs) {
			/* ngIf subclasses scope, using this for simplicity down the road */
			if (attrs.editor) {
				element.appendChild(elements.columns.clone());
			} else {
				element.appendChild(elements.fluid.clone());
			}
			return link;
		}

		function link(scope, element, attrs, controllers) {
			var portalController = controllers[0];
			scope.sortableClass = 'portal-' + (++scope.portalId) + '-widgets';
			scope.sortableOptions = {
				placeholder: 'portal-placeholder',
				connectWith: scope.sortableClass
			};
			scope.$watch('columnCount', columnCountChanged);
			scope.$watch('all', allChanged);
			return;

			function columnCountChanged(count) {
				var indices = [];
				for (var index = 0; index < count; index++) {
					indices.push(index);
				}
				scope.columnIndices = columns;
			}

			/* Model-value changed, update columns */
			function allChanged(value) {
				scope.byColumn = _(value).groupBy('column');
			}
		}
	}

})(window.angular);

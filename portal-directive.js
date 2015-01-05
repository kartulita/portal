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

		/*
		 * Use jQuery to create templates instead of angular.element as the
		 * latter will prematurely compile them and make a mess.
		 */
		var elements = {};
		/* Widget container (requires ngModel) */
		elements.widgets = angular.element('<div/>')
			.attr({
				'ng-class': 'sortableClass',
				'ui-sortable': 'sortableOptions'
			});
		/* Widget */
		elements.widget = angular.element('<div/>')
			.attr('widget', 'widget');
		/* Container for fluid layout */
		elements.fluid = elements.widgets.clone()
			.addClass('portal-fluid')
			.attr({ 'ng-model': 'all' })
			.append(elements.widget.clone()
				.attr({ 'ng-repeat': 'widget in all' })
			);
		/* Column for column layout */
		elements.column = elements.widgets.clone()
			.addClass('portal-column')
			.attr({ 'ng-model': 'byColumn[columnIndex]' })
			.append(elements.widget.clone()
				.attr({ 'ng-repeat': 'widget in byColumn[columnIndex]' })
			);
		/* Column container for column layout */
		elements.columns = angular.element('<div/>')
			.addClass('portal-columns')
			.attr({ 'ng-repeat': 'columnIndex in columnIndices' })
			.append(elements.column.clone());
		return {
			restrict: 'EA',
			require: ['portal'],
			scope: {
				columnCount: '=columns',
				all: '=widgets',
				editor: '@'
			},
			controller: 'portalController',
			compile: compile
		}

		function compile(element, attrs) {
			element.addClass('portal');
			return link;
		}

		function link(scope, element, attrs, controllers) {
			var portalController = controllers[0];
			scope.sortableClass = 'portal-' + (++portalId) + '-widgets';
			scope.sortableOptions = {
				placeholder: 'portal-placeholder',
				connectWith: scope.sortableClass
			};
			scope.$watch('columnCount', columnCountChanged);
			scope.$watch('all', allChanged);
			scope.$watch('editor', editorChanged);
			return;

			function columnCountChanged(count) {
				var indices = [];
				for (var index = 0; index < count; index++) {
					indices.push(index);
				}
				scope.columnIndices = indices;
			}

			/* Model-value changed, update columns */
			function allChanged(value) {
				scope.byColumn = _(value).groupBy('column');
			}

			/* Enable/disable editor */
			function editorChanged(value) {
				element.empty();
				var content = null;
				if (value) {
					content = elements.columns.clone();
					element.addClass('editor');
				} else {
					content = elements.fluid.clone();
					element.removeClass('editor');
				}
				element.append($compile(content)(scope));
			}
		}
	}

})(window.angular, window._, window.$);

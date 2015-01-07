(function (angular) {
	'use strict';

	var portalTemplate = [
		'<div class="portal-area widget-area" ng-repeat="area in areas" ng-class="area.class">',
		'  <div class="area-edit-buttons" ng-if="editing">',
		'    <button class="fa area-edit-button add" ng-click="add(area)">&#xf067;</button>',
		'  </div>',
		'  <ol ng-model="area.widgets" ui-sortable="sortableOptions" class="widget-list" ng-class="sortableClass">',
		'    <li ng-repeat="widget in area.widgets" widget="widget" editing="editing" onremove="remove(area, widget)" onconfigure="configure(widget)">',
		'    </li>',
		'  </ol>',
		'</div>'
	].join('\n');

	angular.module('battlesnake.portal')
		.constant('portalTemplate', portalTemplate);

})(window.angular);

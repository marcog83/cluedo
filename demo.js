/**
 * Created by marco.gobbi on 03/02/2015.
 */

/*
* <scrollable></scrollable>
*
*     <div scrollable></div>
*
*
*
* */


app.directive("scrollable", [
	"dep1",
	"dep2",
	function TreeviewDirective(model, contextMenu, treeviewController) {
		return {
			restrict:"E",
			link: function ($scope, eleemtn, atts) {
			},
			templateUrl:"id/component.html"
		}
	}
]);


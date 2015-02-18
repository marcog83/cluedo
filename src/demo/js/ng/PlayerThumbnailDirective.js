/**
 * Created by marco.gobbi on 18/02/2015.
 */
define(function (require) {
	"use strict";
	var CharacterMap = require("../CharacterMap");

	function PlayerThumbnailDirective(model) {
		function PlayerThumbnail($scope) {
			this.$scope = $scope;
			this.model = $scope.model = model;
			$scope.$watch("player.character", this.getName.bind(this));
			$scope.getName = this.getName.bind(this);
		}

		PlayerThumbnail.prototype = {
			getName: function () {
				return CharacterMap[this.$scope.player.character].label;
			}
		};
		return {
			restrict: "EA",
			scope: {
				player: "=playerThumbnail"
			},
			link: function ($scope) {
				new PlayerThumbnail($scope);
			},
			templateUrl: "partials/player-thumbnail.html"
		}
	}

	return [
		"gameModel",
		PlayerThumbnailDirective
	];
});
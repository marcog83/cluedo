require.config({
	paths: {
		signals: "../bower_components/js-signal-slot/Signal"
	}
});
require(["./Application"], function (Application) {
	Application.main();

});
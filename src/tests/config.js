/**
 * Created by marco.gobbi on 03/02/2015.
 */
require.config({
    paths: {
        signals: "../../bower_components/js-signal-slot/Signal",
        lodash: "../../bower_components/lodash/lodash.min"
    }
});
require(["./Application"], function (Application) {
    Application.main();
});
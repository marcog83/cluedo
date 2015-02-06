/**
 * Created by marco.gobbi on 03/02/2015.
 */
require.config({
    paths: {
        'js-signal-slot': "../../bower_components/js-signal-slot/Signal",
        'lodash': "../../bower_components/lodash/lodash",
        'bluebird': "../../node_modules/bluebird/js/browser/bluebird.min"
    }
});
require(["./Application"], function (Application) {
    Application.main();
});
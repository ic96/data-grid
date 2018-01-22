"use strict";
var LeagueFilterHelper_1 = require("./LeagueFilterHelper");
var OrFilter = (function () {
    function OrFilter() {
    }
    OrFilter.EBNF_OR = function (where, id, championData) {
        var EBNF = Object.keys(where)[0];
        var filtered_data = { champData: new Array() };
        var filter = where[EBNF];
        var filtered_result = LeagueFilterHelper_1.default.EBNFTranslator(filter[0], id, championData);
        for (var i = 1; i < filter.length; i++) {
            var map = {};
            var second_result = LeagueFilterHelper_1.default.EBNFTranslator(filter[i], id, championData);
            filtered_result.champData.forEach(function (instance) {
                var instance_string = JSON.stringify(instance);
                map[instance_string] = true;
            });
            second_result.champData.forEach(function (instance) {
                var instance_string = JSON.stringify(instance);
                map[instance_string] = true;
            });
            Object.keys(map).forEach(function (key) {
                filtered_data.champData.push(JSON.parse(key));
            });
        }
        return filtered_data;
    };
    return OrFilter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OrFilter;
//# sourceMappingURL=OrFilter.js.map
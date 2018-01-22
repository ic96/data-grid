"use strict";
var LeagueFilterHelper_1 = require("./LeagueFilterHelper");
var AndFilter = (function () {
    function AndFilter() {
    }
    AndFilter.EBNF_AND = function (where, id, championData) {
        var where_filter = Object.keys(where)[0];
        var filter = where[where_filter];
        var filtered_result = LeagueFilterHelper_1.default.EBNFTranslator(filter[0], id, championData);
        var result;
        for (var i = 1; i < filter.length; i++) {
            var map = {};
            var finalresult = { champData: new Array() };
            var second_result = LeagueFilterHelper_1.default.EBNFTranslator(filter[i], id, championData);
            filtered_result.champData.forEach(function (instance) {
                var instance_string = JSON.stringify(instance);
                map[instance_string] = false;
            });
            second_result.champData.forEach(function (instance) {
                var instance_string = JSON.stringify(instance);
                if (map[instance_string] == false) {
                    map[instance_string] = true;
                }
            });
            Object.keys(map).forEach(function (key) {
                if (map[key] == true) {
                    finalresult.champData.push(JSON.parse(key));
                }
            });
            filtered_result = finalresult;
        }
        return filtered_result;
    };
    return AndFilter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AndFilter;
//# sourceMappingURL=AndFilter.js.map
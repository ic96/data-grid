"use strict";
var LeagueFilterHelper_1 = require("./LeagueFilterHelper");
var NotFilter = (function () {
    function NotFilter() {
    }
    NotFilter.EBNF_NOT = function (where, id, championData, dataObject) {
        var where_filter = Object.keys(where)[0];
        var filtered_data = { champData: new Array() };
        var filter = where[where_filter];
        var map = {};
        var nested_filter_result = LeagueFilterHelper_1.default.EBNFTranslator(filter, id, championData);
        dataObject.champData.forEach(function (object) {
            object.result.forEach(function (instance) {
                var instance_string = JSON.stringify(instance);
                map[instance_string] = true;
            });
        });
        nested_filter_result.champData.forEach(function (instance) {
            var instance_string = JSON.stringify(instance);
            map[instance_string] = false;
        });
        var mapkey = Object.keys(map);
        mapkey.forEach(function (key) {
            if (map[key] == true)
                filtered_data.champData.push(JSON.parse(key));
        });
        return filtered_data;
    };
    return NotFilter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFilter;
//# sourceMappingURL=NotFilter.js.map
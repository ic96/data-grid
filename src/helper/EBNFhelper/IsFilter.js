"use strict";
var IsFilter = (function () {
    function IsFilter() {
    }
    IsFilter.EBNF_IS = function (where, id, championData, dataObject) {
        var where_filter = Object.keys(where)[0];
        var filtered_data = { champData: new Array() };
        var key = Object.keys(where[where_filter])[0];
        var orgID = key;
        if (key) {
            dataObject.champData.forEach(function (json) {
                var jsonData = json["data"];
                var championName = Object.keys(jsonData)[0];
                var champion = jsonData[championName];
                var championInfo = Object.keys(champion);
                championInfo.forEach(function (c_key) {
                    var instance_value = champion[c_key];
                    var string_instance = String(instance_value).toLowerCase();
                    var q_string = where[where_filter][orgID];
                    var query_string = q_string.toLowerCase();
                    var no_star_query = query_string.split("*").join("");
                    if (query_string.startsWith("*") && query_string.endsWith("*")) {
                        var filtered_string = string_instance.includes(no_star_query);
                        if (filtered_string) {
                            filtered_data.champData.push(c_key);
                        }
                    }
                    else if (query_string.startsWith("*")) {
                        var filtered_string = string_instance.endsWith(no_star_query);
                        if (filtered_string) {
                            filtered_data.champData.push(c_key);
                        }
                    }
                    else if (query_string.endsWith("*")) {
                        var filtered_string = string_instance.startsWith(no_star_query);
                        if (filtered_string) {
                            filtered_data.champData.push(c_key);
                        }
                    }
                    else if (query_string == string_instance) {
                        filtered_data.champData.push(c_key);
                    }
                });
            });
        }
        return filtered_data;
    };
    return IsFilter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IsFilter;
//# sourceMappingURL=IsFilter.js.map
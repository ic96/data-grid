"use strict";
var CompareFilters = (function () {
    function CompareFilters() {
    }
    CompareFilters.EBNF_GT = function (where, id, championData, dataObject) {
        var where_filter = Object.keys(where)[0];
        var filtered_data = { champData: new Array() };
        var key = Object.keys(where)[0];
        dataObject.champData.forEach(function (array) {
            array.result.forEach(function (instance) {
                var queryValue = where[where_filter];
                if (typeof queryValue[key] == "number") {
                    if (instance[key] > queryValue[key]) {
                        filtered_data.champData.push(instance);
                    }
                }
                else
                    throw {
                        code: 400,
                        message: queryValue[key] + " is not a number"
                    };
            });
        });
        return filtered_data;
    };
    CompareFilters.EBNF_EQ = function (where, id, championData, dataObject) {
        var where_filter = Object.keys(where)[0];
        var filtered_data = { champData: new Array() };
        var key = Object.keys(where[where_filter])[0];
        dataObject.champData.forEach(function (array) {
            array.result.forEach(function (instance) {
                var queryValue = where[where_filter];
                if (typeof queryValue[key] == "number") {
                    if (instance[key] == queryValue[key]) {
                        filtered_data.champData.push(instance);
                    }
                }
                else
                    throw {
                        code: 400,
                        message: queryValue[key] + " is not a number"
                    };
            });
        });
    };
    CompareFilters.EBNF_LT = function (where, id, championData, dataObject) {
        var where_filter = Object.keys(where)[0];
        var filtered_data = { champData: new Array() };
        var key = Object.keys(where[where_filter])[0];
        dataObject.champData.forEach(function (array) {
            array.result.forEach(function (instance) {
                var queryValue = where[where_filter];
                if (typeof queryValue[key] == "number") {
                    if (instance[key] < queryValue[key]) {
                        filtered_data.champData.push(instance);
                    }
                }
                else
                    throw {
                        code: 400,
                        message: queryValue[key] + " is not a number"
                    };
            });
        });
        return filtered_data;
    };
    return CompareFilters;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompareFilters;
//# sourceMappingURL=CompareFilters.js.map
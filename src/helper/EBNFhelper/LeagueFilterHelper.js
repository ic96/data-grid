"use strict";
var OrFilter_1 = require("./OrFilter");
var AndFilter_1 = require("./AndFilter");
var CompareFilters_1 = require("./CompareFilters");
var IsFilter_1 = require("./IsFilter");
var NotFilter_1 = require("./NotFilter");
var LeagueFilterHelper = (function () {
    function LeagueFilterHelper() {
    }
    LeagueFilterHelper.EBNFTranslator = function (where, id, championData) {
        var dataObject;
        dataObject = { champData: championData };
        if (Object.keys(where).length == 0) {
            var filtered_data1 = { champData: new Array() };
            dataObject.champData.forEach(function (value) {
                value.result.forEach(function (instance) {
                    filtered_data1.champData.push(instance);
                });
            });
            return filtered_data1;
        }
        var where_filter = Object.keys(where)[0];
        var filtered_results = { champData: new Array() };
        switch (where_filter) {
            case "OR":
                filtered_results = OrFilter_1.default.EBNF_OR(where, id, championData);
                break;
            case "AND":
                filtered_results = AndFilter_1.default.EBNF_AND(where, id, championData);
                break;
            case "GT":
                filtered_results = CompareFilters_1.default.EBNF_GT(where, id, championData, dataObject);
                break;
            case "EQ":
                filtered_results = CompareFilters_1.default.EBNF_EQ(where, id, championData, dataObject);
                break;
            case "LT":
                filtered_results = CompareFilters_1.default.EBNF_LT(where, id, championData, dataObject);
                break;
            case "IS":
                filtered_results = IsFilter_1.default.EBNF_IS(where, id, championData, dataObject);
                break;
            case "NOT":
                filtered_results = NotFilter_1.default.EBNF_NOT(where, id, championData, dataObject);
                break;
            default:
                return filtered_results;
        }
        return filtered_results;
    };
    return LeagueFilterHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeagueFilterHelper;
//# sourceMappingURL=LeagueFilterHelper.js.map
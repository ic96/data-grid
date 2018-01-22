"use strict";
var LeagueFilterHelper_1 = require("../helper/EBNFhelper/LeagueFilterHelper");
var ApplyHelper_1 = require("../helper/ApplyHelper");
var ColumnsHelper_1 = require("../helper/ColumnsHelper");
var LeagueQueryController = (function () {
    function LeagueQueryController(insight) {
        this.insight = insight;
    }
    LeagueQueryController.prototype.invalidQuery = function (query) {
        return (!query.TRANSFORMATIONS.APPLY);
    };
    LeagueQueryController.prototype.query = function (query) {
        if (!query.TRANSFORMATIONS) {
            return this.getResult(query.WHERE, query.OPTIONS.ORDER, query.OPTIONS.FORM, query.OPTIONS.COLUMNS);
        }
        else if (this.invalidQuery(query)) {
            throw {
                code: 400,
                message: "Apply not found"
            };
        }
        return this.getResult(query.WHERE, query.OPTIONS.ORDER, query.OPTIONS.FORM, query.OPTIONS.COLUMNS, query.TRANSFORMATIONS.APPLY);
    };
    LeagueQueryController.prototype.orderDir = function (keys, direction, data) {
        var result = {};
        result = data;
        var transKey = [];
        keys.forEach(function (key) {
            transKey.push(key);
        });
        var same = -1;
        var change = 1;
        if (direction == "DOWN") {
            change = -1;
            same = 1;
        }
        result.champData.sort(function (number1, number2) {
            var value = 0;
            var key;
            for (var i = 0; i < transKey.length; i++) {
                key = transKey[i];
                if (number1[key] > number2[key]) {
                    value = change;
                    break;
                }
                if (number1[key] < number2[key]) {
                    value = same;
                    break;
                }
            }
            return value;
        });
        return result;
    };
    LeagueQueryController.prototype.getResult = function (where, order, form, field, apply) {
        var column = [];
        var data;
        var id;
        ColumnsHelper_1.default.validField(field, column, id);
        data = this.insight.getDataset("LoLData");
        if (!data) {
            return { missing: id };
        }
        var result = LeagueFilterHelper_1.default.EBNFTranslator(where, "LoLData", data);
        if (apply) {
            result = ApplyHelper_1.default.applyResults(apply, result);
        }
        if (column.length > 0) {
            result = ColumnsHelper_1.default.filterCol(column, result);
        }
        if (order) {
            if (order.keys) {
                if (column.indexOf(order.keys[0]) < 0) {
                    throw {
                        code: 400,
                        message: order.keys[0] + " not in Columns"
                    };
                }
            }
            else if (column.indexOf(order) < 0) {
                throw {
                    code: 400,
                    message: order + " not in Columns"
                };
            }
        }
        if (order) {
            if (typeof order == "string") {
                result = ColumnsHelper_1.default.sortColumn(order, result);
            }
            else {
                var direction = order.dir;
                if (direction !== "DOWN" && direction !== "UP") {
                    throw {
                        code: 400,
                        message: "Invalid direction"
                    };
                }
                else {
                    var keys = order.keys;
                    result = this.orderDir(keys, direction, result);
                }
            }
        }
        if (form !== "TABLE") {
            throw {
                code: 400,
                message: "Invalid FORM"
            };
        }
        return {
            body: {
                "render": form,
                "result": result.champData
            }
        };
    };
    return LeagueQueryController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeagueQueryController;
//# sourceMappingURL=LeagueQueryController.js.map
"use strict";
var ApplyHelper = (function () {
    function ApplyHelper() {
    }
    ApplyHelper.applyResults = function (apply, set) {
        var that = this;
        var filter_result = { champData: new Array() };
        Object.keys(set).forEach(function (termInstance) {
            var setItems = set[termInstance];
            var item = {};
            apply.forEach(function (term) {
                var id = Object.keys(term)[0];
                item[id] = this.applyTerms(term[id], setItems);
            });
            filter_result.champData.push(item);
        });
        return filter_result;
    };
    ApplyHelper.prototype.applyTerms = function (termKey, setInstance) {
        var that = this;
        var applyToken = Object.keys(termKey)[0];
        var result;
        var term = termKey[applyToken];
        switch (applyToken) {
            case "MIN":
                var minimum_1 = Number.MAX_SAFE_INTEGER;
                setInstance.forEach(function (item) {
                    if (typeof item[term] == "number") {
                        var value = item[term];
                        if (value < minimum_1) {
                            minimum_1 = value;
                        }
                    }
                    else
                        throw {
                            code: 400,
                            message: item[term] + " is not a number"
                        };
                });
                result = minimum_1;
                break;
            case "MAX":
                var maximum = 0;
                setInstance.forEach(function (item) {
                    if (typeof item[term] == "number") {
                        var value = item[term];
                        if (value > maximum) {
                            maximum = value;
                        }
                    }
                    else
                        throw {
                            code: 400,
                            message: item[term] + " is not a number"
                        };
                });
                result = maximum;
                break;
            case "AVG":
                var average = 0;
                setInstance.forEach(function (item) {
                    if (typeof item[term] == "number") {
                        average += item[term];
                    }
                    else
                        throw {
                            code: 400,
                            message: item[term] + "is not a number"
                        };
                });
                result = (average / setInstance.length).toFixed(2);
                break;
            case "COUNT":
                var count = 0;
                var items_1 = {};
                setInstance.forEach(function (item) {
                    var value = item[term];
                    if (!items_1[value]) {
                        items_1[value] = true;
                        count++;
                    }
                });
                result = count;
                break;
            case "SUM":
                var sum = 0;
                setInstance.forEach(function (item) {
                    if (typeof item[term] == "number") {
                        var term1 = item[term];
                        sum += term1;
                    }
                    else
                        throw {
                            code: 400,
                            message: item[term] + " is not a number"
                        };
                });
                result = sum;
                break;
        }
        return Number(result);
    };
    return ApplyHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplyHelper;
//# sourceMappingURL=ApplyHelper.js.map
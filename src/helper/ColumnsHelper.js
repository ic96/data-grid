"use strict";
var ColumnsHelper = (function () {
    function ColumnsHelper() {
    }
    ColumnsHelper.sortColumn = function (order, data) {
        var result = {};
        var that = this;
        result = data;
        result.champData.sort(function (object1, object2) {
            if (object1[order] < object2[order]) {
                return -1;
            }
            if (object1[order] > object2[order]) {
                return 1;
            }
            return 0;
        });
        return result;
    };
    ColumnsHelper.filterCol = function (column, results) {
        var i = 0;
        results.champData.forEach(function (object) {
            var filteredobj = {};
            column.forEach(function (id) {
                var JSONkey = object[id];
                filteredobj[id] = JSONkey;
            });
            object = filteredobj;
            results.champData[i] = object;
            i++;
        });
        return results;
    };
    ColumnsHelper.validField = function (field, column, id) {
        if (field == "string") {
            id = field;
            column.push(field);
        }
        else
            field.forEach(function (element) {
                column.push(element);
            });
    };
    return ColumnsHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColumnsHelper;
//# sourceMappingURL=ColumnsHelper.js.map
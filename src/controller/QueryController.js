"use strict";
var querystring_1 = require("querystring");
var QueryController = (function () {
    function QueryController(insight) {
        this.translator = {
            "dept": "Subject",
            "id": "Course",
            "avg": "Avg",
            "instructor": "Professor",
            "title": "Title",
            "pass": "Pass",
            "fail": "Fail",
            "audit": "Audit",
            "uuid": "id",
            "year": "Year",
            "fullname": "rooms_fullname",
            "shortname": "rooms_shortname",
            "number": "rooms_number",
            "name": "rooms_name",
            "address": "rooms_address",
            "seats": "rooms_seats",
            "type": "rooms_type",
            "furniture": "rooms_furniture",
            "lat": "rooms_lat",
            "lon": "rooms_lon",
            "href": "rooms_href"
        };
        this.insight = insight;
    }
    QueryController.prototype.invalidQuery = function (query) {
        return (query.TRANSFORMATIONS.GROUP && !query.TRANSFORMATIONS.APPLY || query.TRANSFORMATIONS.APPLY &&
            !query.TRANSFORMATIONS.GROUP);
    };
    QueryController.prototype.query = function (query) {
        if (!query.TRANSFORMATIONS) {
            return this.getResult(query.WHERE, query.OPTIONS.ORDER, query.OPTIONS.FORM, query.OPTIONS.COLUMNS);
        }
        else if (this.invalidQuery(query)) {
            throw {
                code: 400,
                message: "Either group or apply not found"
            };
        }
        return this.getResult(query.WHERE, query.OPTIONS.ORDER, query.OPTIONS.FORM, query.OPTIONS.COLUMNS, query.TRANSFORMATIONS.APPLY, query.TRANSFORMATIONS.GROUP);
    };
    QueryController.prototype.filterCol = function (column, results, bool) {
        var transColumn = [];
        var that = this;
        var i = 0;
        results.courses.forEach(function (object) {
            var filteredobj = {};
            column.forEach(function (id) {
                if (id.includes("_")) {
                    var orgID = id.split("_");
                    if (bool) {
                        var transId = that.translator[orgID[1]];
                        var JSONkey = object[transId];
                        filteredobj[id] = JSONkey;
                    }
                    else {
                        transId = id;
                    }
                }
                else {
                    transId = id;
                    var JSONkey = object[transId];
                    filteredobj[id] = JSONkey;
                }
                filteredobj[id] = object[transId];
            });
            object = filteredobj;
            results.courses[i] = object;
            i++;
        });
        return results;
    };
    QueryController.prototype.groupTerms = function (group, data) {
        var that = this;
        var set = {};
        data.courses.forEach(function (object) {
            var termInstance = "";
            group.forEach(function (term) {
                if (term.includes("courses")) {
                    var key = term.split("_");
                    var transKey = that.translator[key[1]];
                    termInstance += object[transKey];
                }
                else
                    termInstance += object[term];
            });
            if (!set[termInstance]) {
                set[termInstance] = [object];
            }
            else {
                set[termInstance].push(object);
            }
        });
        return set;
    };
    QueryController.prototype.group_and_apply = function (apply, group, set) {
        var that = this;
        var filter_result = { courses: new Array() };
        Object.keys(set).forEach(function (termInstance) {
            var setItems = set[termInstance];
            var item = {};
            apply.forEach(function (term) {
                var id = Object.keys(term)[0];
                item[id] = that.applyArithmetic(term[id], setItems);
            });
            group.forEach(function (term) {
                if (term.includes("courses")) {
                    var orgID = term;
                    var transKey = that.translator[term.split("_")[1]];
                    item[term] = setItems[0][transKey];
                }
                else
                    item[term] = setItems[0][term];
            });
            filter_result.courses.push(item);
        });
        return filter_result;
    };
    QueryController.prototype.applyArithmetic = function (termKey, setInstance) {
        var that = this;
        var applyToken = Object.keys(termKey)[0];
        var result;
        var term = termKey[applyToken];
        if (term.includes("courses")) {
            var key = term.split("_");
            term = that.translator[key[1]];
        }
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
            default: if (typeof applyToken !== "undefined") {
                throw {
                    code: 400,
                    message: applyToken + " is an invalid apply"
                };
            }
        }
        return Number(result);
    };
    QueryController.prototype.orderDir = function (keys, direction, data) {
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
        result.courses.sort(function (number1, number2) {
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
    QueryController.prototype.getResult = function (where, order, form, field, apply, group) {
        var column = [];
        var data;
        var id;
        var that = this;
        if (apply) {
            apply.forEach(function (term) {
                var stringCheck = querystring_1.stringify(term);
                if (stringCheck.includes("_")) {
                    throw {
                        code: 400,
                        message: term + " contains underscore"
                    };
                }
            });
        }
        if (field == "string" && field) {
            var key = field.split("_");
            id = key[0];
            column.push(field);
        }
        else
            field.forEach(function (element) {
                var splitElement = element.split("_");
                if (splitElement[1]) {
                    if (id && id !== splitElement[0]) {
                        throw {
                            code: 424,
                            message: "Multiple datasets not allowed"
                        };
                    }
                    id = splitElement[0];
                }
                column.push(element);
            });
        data = this.insight.getDataset(id);
        if (!data) {
            return { missing: id };
        }
        if (apply && group) {
            if (group.length == 0) {
                throw {
                    code: 400,
                    message: "Empty group"
                };
            }
            else {
                var map = {};
                group.forEach(function (term) {
                    if (!term.includes("_")) {
                        throw {
                            code: 400,
                            message: term + " does not have underscore"
                        };
                    }
                });
                apply.forEach(function (term) {
                    var apply_id = Object.keys(term)[0];
                    if (apply_id.split("_")[1]) {
                        throw {
                            code: 400,
                            message: id + " has underscore"
                        };
                    }
                    if (map[apply_id]) {
                        throw {
                            code: 400,
                            message: "Duplicate"
                        };
                    }
                    map[apply_id] = true;
                });
            }
            for (var x = 0; x < column.length; x++) {
                if (column[x].includes("_")) {
                    if (group.indexOf(column[x]) < 0) {
                        throw {
                            code: 400,
                            message: column[x] + " is not in GROUP"
                        };
                    }
                }
                else {
                    var len = 0;
                    apply.forEach(function (term) {
                        if (Object.keys(term)[0] == column[x]) {
                            len++;
                        }
                    });
                    if (len == 0) {
                        throw {
                            code: 400,
                            message: "Column is not in APPLY"
                        };
                    }
                }
            }
        }
        var result = this.EBNFTranslator(where, id, data);
        if (apply && group) {
            result = this.groupTerms(group, result);
            result = this.group_and_apply(apply, group, result);
        }
        if (column.length > 0) {
            var bool = true;
            if (group && apply) {
                bool = false;
            }
            result = this.filterCol(column, result, bool);
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
            var that_1 = this;
            if (typeof order == "string") {
                var transOrder = order.split("_");
                var stringCheck = that_1.translator[transOrder[1]];
                if (typeof stringCheck == "string" && transOrder[0] == id || transOrder[0] == order) {
                    result = that_1.sortColumn(order, result);
                }
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
        if (apply && group && order) {
            var duplicateArray_1;
            apply.forEach(function (key) {
                var token = key.Object;
                switch (token) {
                    case "minSeats":
                        if (duplicateArray_1.indexOf(token) < 0) {
                            duplicateArray_1.push(token);
                        }
                        else
                            throw {
                                code: 400,
                                message: "Duplicate apply keys"
                            };
                        if (column.indexOf(token) < 0) {
                            if (!order.keys[0] == token || !order == token) {
                                throw {
                                    code: 400,
                                    message: token + " is not in either columns or order"
                                };
                            }
                        }
                        break;
                    case "maxSeats":
                        if (duplicateArray_1.indexOf(token) < 0) {
                            duplicateArray_1.push(token);
                        }
                        else
                            throw {
                                code: 400,
                                message: "Duplicate apply keys"
                            };
                        if (column.indexOf(token) < 0) {
                            if (!order.keys[0] == token || !order == token) {
                                throw {
                                    code: 400,
                                    message: token + " is not in either columns or order"
                                };
                            }
                        }
                        break;
                    case "sumSeats":
                        if (duplicateArray_1.indexOf(token) < 0) {
                            duplicateArray_1.push(token);
                        }
                        else
                            throw {
                                code: 400,
                                message: "Duplicate apply keys"
                            };
                        if (column.indexOf(token) < 0) {
                            if (!order.keys[0] == token || !order == token) {
                                throw {
                                    code: 400,
                                    message: token + " is not in either columns or order"
                                };
                            }
                        }
                        break;
                    case "countSeats":
                        if (duplicateArray_1.indexOf(token) < 0) {
                            duplicateArray_1.push(token);
                        }
                        else
                            throw {
                                code: 400,
                                message: "Duplicate apply keys"
                            };
                        if (column.indexOf(token) < 0) {
                            if (!order.keys[0] == token || !order == token) {
                                throw {
                                    code: 400,
                                    message: token + " is not in either columns or order"
                                };
                            }
                        }
                        break;
                    default: break;
                }
            });
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
                "result": result.courses
            }
        };
    };
    QueryController.prototype.sortColumn = function (order, data) {
        var result = {};
        var that = this;
        result = data;
        result.courses.sort(function (object1, object2) {
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
    QueryController.prototype.EBNFTranslator = function (where, id, data) {
        var dataObject;
        dataObject = {
            courses: data
        };
        if (Object.keys(where).length == 0) {
            var filtered_data1 = { courses: new Array() };
            dataObject.courses.forEach(function (value) {
                value.result.forEach(function (instance) {
                    filtered_data1.courses.push(instance);
                });
            });
            return filtered_data1;
        }
        var operator = Object.keys(where)[0];
        var filtered_results = { courses: new Array() };
        switch (operator) {
            case "OR":
                {
                    var filtered_data = { courses: new Array() };
                    var filter = where[operator];
                    var filtered_result = this.EBNFTranslator(filter[0], id, data);
                    for (var i = 1; i < filter.length; i++) {
                        var map = {};
                        var second_result = this.EBNFTranslator(filter[i], id, data);
                        filtered_result.courses.forEach(function (instance) {
                            var instance_string = JSON.stringify(instance);
                            map[instance_string] = true;
                        });
                        second_result.courses.forEach(function (instance) {
                            var instance_string = JSON.stringify(instance);
                            map[instance_string] = true;
                        });
                        Object.keys(map).forEach(function (key) {
                            filtered_data.courses.push(JSON.parse(key));
                        });
                    }
                    filtered_results = filtered_data;
                }
                break;
            case "AND":
                {
                    var filtered_data = { courses: new Array() };
                    var filter = where[operator];
                    var filtered_result = this.EBNFTranslator(filter[0], id, data);
                    var result;
                    for (var i = 1; i < filter.length; i++) {
                        var map = {};
                        var finalresult = { courses: new Array() };
                        var second_result = this.EBNFTranslator(filter[i], id, data);
                        filtered_result.courses.forEach(function (instance) {
                            var instance_string = JSON.stringify(instance);
                            map[instance_string] = false;
                        });
                        second_result.courses.forEach(function (instance) {
                            var instance_string = JSON.stringify(instance);
                            if (map[instance_string] == false) {
                                map[instance_string] = true;
                            }
                        });
                        Object.keys(map).forEach(function (key) {
                            if (map[key] == true) {
                                finalresult.courses.push(JSON.parse(key));
                            }
                        });
                        filtered_result = finalresult;
                    }
                    filtered_results = filtered_result;
                }
                break;
            case "GT":
                var filtered_data = { courses: new Array() };
                var key = Object.keys(where[operator])[0];
                var completeKey = key;
                var object = key.split("_");
                if (object[0] !== id) {
                    throw {
                        code: 424,
                        message: "invalid id"
                    };
                }
                key = object[1];
                var transKey = this.translator[key];
                if (transKey) {
                    dataObject.courses.forEach(function (array) {
                        array.result.forEach(function (instance) {
                            var queryValue = where[operator];
                            if (typeof queryValue[completeKey] == "number") {
                                if (instance[transKey] > queryValue[completeKey]) {
                                    filtered_data.courses.push(instance);
                                }
                            }
                            else
                                throw {
                                    code: 400,
                                    message: queryValue[completeKey] + " is not a number"
                                };
                        });
                    });
                }
                else
                    throw {
                        code: 400, message: key + " is an invalid key"
                    };
                filtered_results = filtered_data;
                break;
            case "EQ":
                var filtered_data = { courses: new Array() };
                var key = Object.keys(where[operator])[0];
                var completeKey = key;
                var object = key.split("_");
                if (object[0] !== id) {
                    throw {
                        code: 424,
                        message: "invalid id"
                    };
                }
                key = object[1];
                var transKey = this.translator[key];
                if (transKey) {
                    dataObject.couses.forEach(function (array) {
                        array.result.forEach(function (instance) {
                            var queryValue = where[operator];
                            if (typeof queryValue[completeKey] == "number") {
                                if (instance[transKey] == queryValue[completeKey]) {
                                    filtered_data.courses.push(instance);
                                }
                            }
                            else
                                throw {
                                    code: 400,
                                    message: queryValue[completeKey] + " is not a number"
                                };
                        });
                    });
                }
                else
                    throw {
                        code: 400,
                        message: key + " is an invalid key"
                    };
                filtered_results = filtered_data;
                break;
            case "LT":
                var filtered_data = { courses: new Array() };
                var key = Object.keys(where[operator])[0];
                var completeKey = key;
                var object = key.split("_");
                if (object[0] !== id) {
                    throw {
                        code: 424,
                        message: "invalid id"
                    };
                }
                key = object[1];
                var transKey = this.translator[key];
                if (transKey) {
                    dataObject.courses.forEach(function (array) {
                        array.result.forEach(function (instance) {
                            var queryValue = where[operator];
                            if (typeof queryValue[completeKey] == "number") {
                                if (instance[transKey] < queryValue[completeKey]) {
                                    filtered_data.courses.push(instance);
                                }
                            }
                            else
                                throw {
                                    code: 400,
                                    message: queryValue[completeKey] + " is not a number"
                                };
                        });
                    });
                }
                else
                    throw { code: 400, message: key + " is an invalid key" };
                filtered_results = filtered_data;
                break;
            case "IS":
                {
                    var filtered_data = { courses: new Array() };
                    var key = Object.keys(where[operator])[0];
                    var orgID_1 = key;
                    var object = key.split("_");
                    if (object[0] !== id) {
                        throw {
                            code: 424,
                            message: "invalid id"
                        };
                    }
                    key = object[1];
                    var transKey = this.translator[key];
                    if (transKey) {
                        dataObject.courses.forEach(function (object) {
                            object.result.forEach(function (instance) {
                                var instance_value = instance[transKey];
                                var string_instance = String(instance_value).toLowerCase();
                                var q_string = where[operator][orgID_1];
                                var query_string = q_string.toLowerCase();
                                var no_star_query = query_string.split("*").join("");
                                if (query_string.startsWith("*") && query_string.endsWith("*")) {
                                    var filtered_string = string_instance.includes(no_star_query);
                                    if (filtered_string) {
                                        filtered_data.courses.push(instance);
                                    }
                                }
                                else if (query_string.startsWith("*")) {
                                    var filtered_string = string_instance.endsWith(no_star_query);
                                    if (filtered_string) {
                                        filtered_data.courses.push(instance);
                                    }
                                }
                                else if (query_string.endsWith("*")) {
                                    var filtered_string = string_instance.startsWith(no_star_query);
                                    if (filtered_string) {
                                        filtered_data.courses.push(instance);
                                    }
                                }
                                else if (query_string == string_instance) {
                                    filtered_data.courses.push(instance);
                                }
                            });
                        });
                        filtered_results = filtered_data;
                    }
                    else
                        throw { code: 400, message: key + " is an invalid key" };
                }
                break;
            case "NOT":
                {
                    var filtered_data = { courses: new Array() };
                    var filter = where[operator];
                    var map = {};
                    var nested_filter_result = this.EBNFTranslator(filter, id, data);
                    dataObject.courses.forEach(function (object) {
                        object.result.forEach(function (instance) {
                            var instance_string = JSON.stringify(instance);
                            map[instance_string] = true;
                        });
                    });
                    nested_filter_result.courses.forEach(function (instance) {
                        var instance_string = JSON.stringify(instance);
                        map[instance_string] = false;
                    });
                    var mapkey = Object.keys(map);
                    mapkey.forEach(function (key) {
                        if (map[key] == true) {
                            filtered_data.courses.push(JSON.parse(key));
                        }
                    });
                    filtered_results = filtered_data;
                }
                break;
            default:
                filtered_results;
                break;
        }
        return filtered_results;
    };
    return QueryController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QueryController;
//# sourceMappingURL=QueryController.js.map
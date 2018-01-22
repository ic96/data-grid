import {Datasets, default as InsightFacade} from "./InsightFacade";
import {QueryRequest} from "./IInsightFacade";
import {stringify} from "querystring";


export interface QueryBody {
    body: any;
    missing: string[];
}

export default class QueryController {
    private insight: InsightFacade;


    constructor(insight: InsightFacade) {
        this.insight = insight;
    }

    private translator: any = {
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

    public invalidQuery(query: QueryRequest): boolean{
        return (query.TRANSFORMATIONS.GROUP && !query.TRANSFORMATIONS.APPLY || query.TRANSFORMATIONS.APPLY &&
        !query.TRANSFORMATIONS.GROUP)
    }

    public query(query: QueryRequest): QueryBody {
    if (!query.TRANSFORMATIONS){
        return this.getResult(query.WHERE, query.OPTIONS.ORDER, query.OPTIONS.FORM, query.OPTIONS.COLUMNS);
    } else if(this.invalidQuery(query)){ throw{
            code: 400,
            message: "Either group or apply not found"
        }
    }

        return this.getResult(query.WHERE,query.OPTIONS.ORDER, query.OPTIONS.FORM, query.OPTIONS.COLUMNS,
            query.TRANSFORMATIONS.APPLY, query.TRANSFORMATIONS.GROUP);
    }

    public filterCol(column: any, results: any, bool: boolean): any {
        let transColumn: string[] = [];
        let that = this;
        let i = 0;

        results.courses.forEach(function(object: any){

            let filteredobj: any = {};
            column.forEach(function(id: string){

                if (id.includes("_")){
                let orgID = id.split("_");
                if (bool) {
                    var transId = that.translator[orgID[1]];
                    let JSONkey = object[transId];
                    filteredobj[id] = JSONkey;
                } else {
                     transId = id;
                }} else {
                    transId = id;
                    let JSONkey = object[transId];
                    filteredobj[id] = JSONkey;
                }
                filteredobj[id] = object[transId];
            });
            object = filteredobj;
            results.courses[i] = object;
            i++;

        });
        return results;

    }

    public groupTerms(group:any, data: any): any{
        let that = this;
    let set: any = {};
        data.courses.forEach(function(object: any){
            let termInstance: string = "";
            group.forEach(function(term: any){
                if (term.includes("courses")){
                    var key = term.split("_");
                    var transKey = that.translator[key[1]];
                    termInstance += object[transKey];
                } else

                termInstance += object[term];
            });
            if (!set[termInstance]){
                set[termInstance] = [object];
            } else{
                set[termInstance].push(object);
            }
        });
        return set;

    }
    public group_and_apply(apply: any, group: any, set: any){
    let that = this;
    let filter_result = {courses: new Array()};
    Object.keys(set).forEach(function(termInstance: any){
        let setItems = set[termInstance];
        let item: any = {};
        apply.forEach(function(term: any){

            let id = Object.keys(term)[0];
            item[id] = that.applyArithmetic(term[id], setItems);
        });
        group.forEach(function(term: any){
            if (term.includes("courses")){
                let orgID = term;
                let transKey = that.translator[term.split("_")[1]];
                item[term] = setItems[0][transKey];
            } else
            item[term] = setItems[0][term];
        });

        filter_result.courses.push(item);
    });
        return filter_result;
    }
    public applyArithmetic(termKey: any, setInstance: any){
        let that = this;

        var applyToken = Object.keys(termKey)[0];


        let result: any;
        let term = termKey[applyToken];
        if(term.includes("courses")){
            var key = term.split("_");
            term = that.translator[key[1]];
        }

        switch (applyToken){
            case "MIN":
            let minimum = Number.MAX_SAFE_INTEGER;
            setInstance.forEach(function(item: any){
                if (typeof item[term] == "number") {
                    let value = item[term];
                    if (value < minimum) {
                        minimum = value;
                    }
                } else throw{
                    code: 400,
                    message: item[term] + " is not a number"
                }

            });

            result = minimum;

            break;
            case "MAX":
                var maximum = 0;
                setInstance.forEach(function(item: any){
                    if (typeof item[term] == "number") {
                        var value = item[term];
                        if (value > maximum) {
                            maximum = value;
                        }
                    } else throw{
                        code: 400,
                        message: item[term] + " is not a number"
                    }
                });

                result = maximum;
            break;
            case "AVG":
            var average = 0;
            setInstance.forEach(function(item: any){
                if (typeof item[term] == "number") {
                    average += item[term];
                } else throw{
                    code: 400,
                    message: item[term] + "is not a number"
                }
            });

            result = (average/setInstance.length).toFixed(2);

            break;
            case "COUNT":
            var count = 0;
            let items:any = {};
            setInstance.forEach(function(item: any){
                let value = item[term];

                if(!items[value]){
                    items[value] = true;
                    count++;

                }
            });

            result = count;
            break;
            case "SUM":
                var sum = 0;
            setInstance.forEach(function(item: any){
                if (typeof item[term] == "number") {
                    let term1 = item[term];
                    sum += term1;
                } else
                    throw {
                    code: 400,
                        message: item[term] + " is not a number"
                    }
            });
            result = sum;
            break;
            default: if (typeof applyToken !== "undefined"){
                throw{
                    code: 400,
                    message: applyToken + " is an invalid apply"
                }
            }

        }
        return Number(result);

    }

    public orderDir(keys: string[], direction: string, data: any){
        var result: any = {};
        result = data;


        let transKey: string[] = [];
        keys.forEach(function(key: any){
            transKey.push(key);
        });
        var same = -1;
        var change = 1;
        if(direction == "DOWN"){
            change = -1;
            same = 1;
        }
        result.courses.sort((number1: any, number2: any) =>{

        var value = 0;
        var key: string;
        for(let i = 0;i< transKey.length; i++){
            key = transKey[i];

            if(number1[key] > number2[key]){
                value = change;
               break;
            }
            if (number1[key] < number2[key]){
                value = same;
                break;
            }
        }
        return value;

        });
        return result;
    }

    public getResult(where:any, order:any, form: any, field: string|string[], apply?: any, group?: string[]): any {
        var column: string[] = [];
        var data: any;
        var id: string;
        let that = this;
        if (apply) {
            apply.forEach(function (term: any) {
                let stringCheck = stringify(term);
                if (stringCheck.includes("_")) {
                    throw{
                        code: 400,
                        message: term + " contains underscore"
                    }
                }
            });
        }
        if (field == "string" && field) {
            var key = field.split("_");
            // returns id
            id = key[0];
            column.push(field);
        } else
            (<string[]> field).forEach(function (element) {
                var splitElement = element.split("_");
                // element = key
                if (splitElement[1]) {
                    if (id && id !== splitElement[0]) {
                        throw{
                            code: 424,
                            message: "Multiple datasets not allowed"
                        }
                    }
                    // id = courses
                    id = splitElement[0];
                }
                // adds element from query.columns to columns
                column.push(element);
            });


        data = this.insight.getDataset(id);
        if (!data){
            return {missing : id};
        }
        if (apply && group){
            if (group.length == 0){
                throw{
                    code: 400,
                    message: "Empty group"
                }
            } else{
                var map: any = {};

                group.forEach(function(term: any) {


                    if (!term.includes("_")) {
                        throw{
                            code: 400,
                            message: term + " does not have underscore"
                        }
                    }
                });
                    apply.forEach(function(term: any){
                        var apply_id = Object.keys(term)[0];
                        if (apply_id.split("_")[1]){
                            throw{
                                code: 400,
                                message: id + " has underscore"
                            }
                        }
                        if(map[apply_id]){
                            throw{
                                code: 400,
                                message: "Duplicate"
                            };
                        }
                        map[apply_id] = true;
                    });

            }
            for(var x = 0; x < column.length; x++){
                if (column[x].includes("_")){
                    if(group.indexOf(column[x]) < 0){
                        throw{
                            code: 400,
                            message: column[x] + " is not in GROUP"
                        }
                    }
                } else {
                    var len = 0;
                    apply.forEach(function (term: any) {
                        if (Object.keys(term)[0] == column[x]) {
                        len++;
                        }

                    });
                    if (len == 0){
                        throw{
                            code: 400,
                            message: "Column is not in APPLY"
                        }
                    }
                }
            }
        }
        var result = this.EBNFTranslator(where, id, data);

        if(apply && group){
            result = this.groupTerms(group,result);
            result = this.group_and_apply(apply, group, result);
        }
        if (column.length > 0) {
            var bool = true;
            if (group && apply){
                bool = false;
            }
            result = this.filterCol(column, result, bool);
        }
        if (order) {
            if (order.keys){
            if (column.indexOf(order.keys[0]) < 0) {
                throw{
                    code: 400,
                    message: order.keys[0] + " not in Columns"
                }
            }
        } else if (column.indexOf(order) < 0) {
                throw{
                    code: 400,
                    message: order + " not in Columns"
                }
            }
        }
        if (order) {
            let that = this;
                        if (typeof order == "string") {
                            let transOrder = order.split("_");
                            let stringCheck = that.translator[transOrder[1]];
                            if (typeof stringCheck == "string" && transOrder[0] == id || transOrder[0] == order) {
                                result = that.sortColumn(order, result);
                            }
                        } else {
                            let direction = order.dir;
                            if (direction !== "DOWN" && direction !== "UP") {
                                throw{
                                    code: 400,
                                    message: "Invalid direction"
                                };
                            } else {
                                let keys = order.keys;
                                result = this.orderDir(keys, direction, result);
                            }
                        }
                }


        if (apply && group && order) {
            let duplicateArray: Array<string>;
            apply.forEach(function (key: any) {
               let token = key.Object;
               switch (token){
                   case "minSeats":
                       if (duplicateArray.indexOf(token) < 0){
                           duplicateArray.push(token);
                       } else throw{
                           code: 400,
                           message: "Duplicate apply keys"
                       };
                       if (column.indexOf(token)< 0){
                           if (!order.keys[0] == token || !order == token){
                               throw{
                                   code: 400,
                                   message: token + " is not in either columns or order"
                               }
                           }
                       }
                       break;
                   case "maxSeats":
                       if (duplicateArray.indexOf(token) < 0){
                           duplicateArray.push(token);
                       } else throw{
                           code: 400,
                           message: "Duplicate apply keys"
                       };
                       if (column.indexOf(token)< 0){
                           if (!order.keys[0] == token || !order == token){
                               throw{
                                   code: 400,
                                   message: token + " is not in either columns or order"
                               }
                           }
                       }
                       break;
                   case "sumSeats":
                       if (duplicateArray.indexOf(token) < 0){
                           duplicateArray.push(token);
                       } else throw{
                           code: 400,
                           message: "Duplicate apply keys"
                       };
                       if (column.indexOf(token)< 0){
                           if (!order.keys[0] == token || !order == token){
                               throw{
                                   code: 400,
                                   message: token + " is not in either columns or order"
                               }
                           }
                       }
                       break;
                   case "countSeats":
                       if (duplicateArray.indexOf(token) < 0){
                           duplicateArray.push(token);
                       } else throw{
                           code: 400,
                           message: "Duplicate apply keys"
                       };
                       if (column.indexOf(token)< 0){
                           if (!order.keys[0] == token || !order == token){
                               throw{
                                   code: 400,
                                   message: token + " is not in either columns or order"
                               }
                           }
                       }
                       break;
                   default: break;
               }
            })
        }

        if(form !== "TABLE"){
            throw{
                code: 400,
                message: "Invalid FORM"
            }
        }

        return {
            body: {
                "render": form,
                "result": result.courses
            }
        }
    }


    private sortColumn(order: string, data: any) {
        var result: any = {};
        let that = this;
        result = data;

        /*result.courses = data.courses.sort((field1: any, field2: any) => {
             if (field1[order] < field2[order]) {
             return -1;
             }
             if (field1[order] > field2[order]) {
             return 1;
             }
             return 0;
             });*/

            // id = eg. avg or dept


            result.courses.sort((object1: any, object2: any) => {
                if (object1[order] < object2[order]) {
                    return -1;
                }
                if (object1[order] > object2[order]) {
                    return 1
                }
                return 0;

            });
            return result;
        }


    public EBNFTranslator(where: any, id: string, data: any) {
        let dataObject: any;
        dataObject = {
            courses: data
        };

        // if {} then filtered_courses is every file
        if (Object.keys(where).length == 0) {
            var filtered_data1 = {courses: new Array()};
            dataObject.courses.forEach(function (value: any) {
                value.result.forEach(function (instance: any) {
                    filtered_data1.courses.push(instance);
                });
            });
            return filtered_data1;
        }
        // logical filters inside where
        var operator = Object.keys(where)[0];
        // stores locally
        var filtered_results = {courses: new Array()};
        switch (operator) {
            case "OR": {
                var filtered_data = {courses: new Array()};
                var filter = where[operator];
                var filtered_result = this.EBNFTranslator(filter[0], id, data);
                // iterate through inner filter
                for (var i = 1; i < filter.length; i++) {
                    var map: any = {};
                    var second_result = this.EBNFTranslator(filter[i], id, data);
                    filtered_result.courses.forEach(function (instance: any) {
                        var instance_string = JSON.stringify(instance);
                        map[instance_string] = true;
                    });
                    second_result.courses.forEach(function (instance: any) {
                        var instance_string = JSON.stringify(instance);
                        map[instance_string] = true;
                    });
                    Object.keys(map).forEach(function (key: any) {
                        filtered_data.courses.push(JSON.parse(key));
                    })
                }
                filtered_results = filtered_data;
            }
                break;
            case "AND": {
                var filtered_data = {courses: new Array()};
                var filter = where[operator];
                var filtered_result = this.EBNFTranslator(filter[0], id, data);
                var result;
                // iterate through inner filter
                for (var i = 1; i < filter.length; i++) {
                    var map: any = {};
                    var finalresult: any = {courses: new Array()};

                    var second_result = this.EBNFTranslator(filter[i], id, data);
                    filtered_result.courses.forEach(function (instance: any) {
                        var instance_string = JSON.stringify(instance);
                        map[instance_string] = false;
                    });
                    second_result.courses.forEach(function (instance: any) {
                        var instance_string = JSON.stringify(instance);
                        if (map[instance_string] == false) {
                            map[instance_string] = true;
                        }
                    });
                    Object.keys(map).forEach(function (key: any) {
                        if (map[key] == true) {
                            finalresult.courses.push(JSON.parse(key));
                        }
                    });
                    filtered_result = finalresult;

                }
                filtered_results = filtered_result
            }
                break;
            case "GT":
                var filtered_data = {courses: new Array()};
                var key = Object.keys(where[operator])[0];
                var completeKey = key;
                // splits course and key
                var object = key.split("_");
                if (object[0] !== id) {
                    throw{
                        code: 424,
                        message: "invalid id"
                    };
                }
                // if valid id then translate the key to query language
                key = object[1];
                var transKey = this.translator[key];
                if (transKey) {
                    dataObject.courses.forEach(function (array: any) {
                        // inside zip courses
                        array.result.forEach(function (instance: any) {
                            var queryValue = where[operator];
                            if (typeof queryValue[completeKey] == "number") {
                                if (instance[transKey] > queryValue[completeKey]) {

                                    filtered_data.courses.push(instance);
                                }
                            } else throw{
                                code: 400,
                                message: queryValue[completeKey] + " is not a number"
                            }
                        })
                    });
                } else throw{
                    code: 400, message: key + " is an invalid key"};
                filtered_results = filtered_data;
                break;
            case "EQ":
                var filtered_data = {courses: new Array()};
                var key = Object.keys(where[operator])[0];
                var completeKey = key;
                // splits course and key
                var object = key.split("_");
                if (object[0] !== id) {
                    throw{
                        code: 424,
                        message: "invalid id"
                    };
                }
                // if valid id then translate the key to query language
                key = object[1];
                var transKey = this.translator[key];
                if (transKey){
                dataObject.couses.forEach(function (array: any) {
                    // inside zip courses
                    array.result.forEach(function (instance: any) {
                        var queryValue = where[operator];
                        if (typeof queryValue[completeKey] == "number") {
                            if (instance[transKey] == queryValue[completeKey]) {
                                filtered_data.courses.push(instance);
                            }
                        } else throw{
                            code: 400,
                            message: queryValue[completeKey] + " is not a number"
                        }
                    })
                });} else throw{
                    code: 400,
                    message: key + " is an invalid key"
                };
                filtered_results = filtered_data;
                break;
            case "LT":
                var filtered_data = {courses: new Array()};
                var key = Object.keys(where[operator])[0];
                var completeKey = key;
                // splits course and key
                var object = key.split("_");
                if (object[0] !== id) {
                    throw{
                        code: 424,
                        message: "invalid id"
                    };
                }
                // if valid id then translate the key to query language
                key = object[1];
                var transKey = this.translator[key];
                if (transKey) {
                    dataObject.courses.forEach(function (array: any) {
                        // inside zip courses
                        array.result.forEach(function (instance: any) {
                            // console.log(where[operator][completeKey]);
                            var queryValue = where[operator];
                            if (typeof queryValue[completeKey] == "number") {
                                if (instance[transKey] < queryValue[completeKey]) {
                                    filtered_data.courses.push(instance);
                                }
                            } else throw{
                                code: 400,
                                message: queryValue[completeKey] + " is not a number"
                            }
                        })
                    });
                } else throw {code: 400, message: key + " is an invalid key"};
                filtered_results = filtered_data;
                break;

            case "IS": {
                var filtered_data = {courses: new Array()};
                var key = Object.keys(where[operator])[0];
                let orgID = key;
                // splits course and key
                var object = key.split("_");
                if (object[0] !== id) {
                    throw{
                        code: 424,
                        message: "invalid id"
                    };
                }
                // if valid id then translate the key to query language
                key = object[1];
                var transKey = this.translator[key];
                if (transKey) {
                    dataObject.courses.forEach(function (object: any) {

                        object.result.forEach(function (instance: any) {

                            var instance_value = instance[transKey];
                            let string_instance = String(instance_value).toLowerCase();
                            var q_string = where[operator][orgID];
                            let query_string = q_string.toLowerCase();

                            var no_star_query = query_string.split("*").join("");
                            //contains
                            if (query_string.startsWith("*") && query_string.endsWith("*")) {
                                var filtered_string = string_instance.includes(no_star_query);
                                if (filtered_string) {
                                    filtered_data.courses.push(instance);
                                } // end with query_string
                            } else if (query_string.startsWith("*")) {
                                var filtered_string = string_instance.endsWith(no_star_query);
                                if (filtered_string) {
                                    filtered_data.courses.push(instance);
                                } // start with query_string
                            } else if (query_string.endsWith("*")) {
                                var filtered_string = string_instance.startsWith(no_star_query);
                                if (filtered_string) {
                                    filtered_data.courses.push(instance);
                                }
                            } else if (query_string == string_instance) {
                                filtered_data.courses.push(instance);
                            }

                        })


                    });
                    filtered_results = filtered_data;
                } else throw{code: 400, message: key + " is an invalid key"}
            }
                break;

            case "NOT": {
                var filtered_data = {courses: new Array()};
                var filter = where[operator];
                var map: any = {};
                // nested inner filter
                var nested_filter_result = this.EBNFTranslator(filter, id, data);
                dataObject.courses.forEach(function (object: any) {
                    object.result.forEach(function (instance: any) {
                        var instance_string = JSON.stringify(instance);
                        map[instance_string] = true;
                    })
                });
                nested_filter_result.courses.forEach(function (instance: any) {
                    var instance_string = JSON.stringify(instance);
                    map[instance_string] = false;
                });
                var mapkey = Object.keys(map);
                mapkey.forEach(function (key: any) {
                    if (map[key] == true) {
                        filtered_data.courses.push(JSON.parse(key));
                    }

                });
                filtered_results = filtered_data;
            }
                break;
            default:
                filtered_results
                break;
        }
        return filtered_results;
    }
}
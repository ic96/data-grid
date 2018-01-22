/**
 * Created by Ian on 2017-08-08.
 */

export default class CompareFilters{

    public static EBNF_GT(where: any, id: string, championData: any, dataObject: any): any{
        var where_filter = Object.keys(where)[0];
        var filtered_data = {champData: new Array()};
        var key = Object.keys(where)[0];
        // splits course and key
        dataObject.champData.forEach(function (array: any) {
            // inside zip courses
            array.result.forEach(function (instance: any) {
                var queryValue = where[where_filter];
                if (typeof queryValue[key] == "number") {
                    if (instance[key] > queryValue[key]) {

                        filtered_data.champData.push(instance);
                    }
                } else throw{
                    code: 400,
                    message: queryValue[key] + " is not a number"
                }
            })
        });
        return filtered_data;
    }

    public static EBNF_EQ(where: any, id: string, championData: any, dataObject: any): any{
        var where_filter = Object.keys(where)[0];
        var filtered_data = {champData: new Array()};
        var key = Object.keys(where[where_filter])[0];
        // if valid id then translate the key to query language
        dataObject.champData.forEach(function (array: any) {
            // inside zip courses
            array.result.forEach(function (instance: any) {
                var queryValue = where[where_filter];
                if (typeof queryValue[key] == "number") {
                    if (instance[key] == queryValue[key]) {
                        filtered_data.champData.push(instance);
                    }
                } else throw{
                    code: 400,
                    message: queryValue[key] + " is not a number"
                }
            })
        });
    }

    public static EBNF_LT(where: any, id: string, championData: any, dataObject: any): any{
        var where_filter = Object.keys(where)[0];
        var filtered_data = {champData: new Array()};
        var key = Object.keys(where[where_filter])[0];
        // if valid id then translate the key to query language
        dataObject.champData.forEach(function (array: any) {
            // inside zip courses
            array.result.forEach(function (instance: any) {
                // console.log(where[operator][completeKey]);
                var queryValue = where[where_filter];
                if (typeof queryValue[key] == "number") {
                    if (instance[key] < queryValue[key]) {
                        filtered_data.champData.push(instance);
                    }
                } else throw{
                    code: 400,
                    message: queryValue[key] + " is not a number"
                }
            })
        });
        return filtered_data;
    }
}
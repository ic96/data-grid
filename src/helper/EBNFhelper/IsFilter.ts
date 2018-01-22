/**
 * Created by Ian on 2017-08-08.
 */

export default class IsFilter{

    public static EBNF_IS(where: any, id: string, championData: any, dataObject: any): any{
        var where_filter = Object.keys(where)[0];
        var filtered_data = {champData: new Array()};
        var key = Object.keys(where[where_filter])[0];
        let orgID = key;
        // if valid id then translate the key to query language
        if (key) {
            dataObject.champData.forEach(function (json: any) {
                var jsonData = json["data"];
                var championName = Object.keys(jsonData)[0];
                var champion = jsonData[championName];
                var championInfo = Object.keys(champion);
                championInfo.forEach(function (c_key: any) {
                    var instance_value = champion[c_key];
                    let string_instance = String(instance_value).toLowerCase();
                    var q_string = where[where_filter][orgID];
                    let query_string = q_string.toLowerCase();

                    var no_star_query = query_string.split("*").join("");
                    //contains
                    if (query_string.startsWith("*") && query_string.endsWith("*")) {
                        var filtered_string = string_instance.includes(no_star_query);
                        if (filtered_string) {
                            filtered_data.champData.push(c_key);
                        } // end with query_string
                    } else if (query_string.startsWith("*")) {
                        var filtered_string = string_instance.endsWith(no_star_query);
                        if (filtered_string) {
                            filtered_data.champData.push(c_key);
                        } // start with query_string
                    } else if (query_string.endsWith("*")) {
                        var filtered_string = string_instance.startsWith(no_star_query);
                        if (filtered_string) {
                            filtered_data.champData.push(c_key);
                        }
                    } else if (query_string == string_instance) {
                        filtered_data.champData.push(c_key);
                    }

                })
            });
        }
        return filtered_data;
    }
}

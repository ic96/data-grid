import LeagueFilterHelper from "./LeagueFilterHelper";
/**
 * Created by Ian on 2017-08-08.
 */

export default class NotFilter{

    public static EBNF_NOT(where: any, id: string, championData: any, dataObject: any): any{
        var where_filter = Object.keys(where)[0];
        var filtered_data = {champData: new Array()};
        var filter = where[where_filter];
        var map: any = {};
        // nested inner filter
        var nested_filter_result = LeagueFilterHelper.EBNFTranslator(filter, id, championData);
        dataObject.champData.forEach(function (object: any) {
            object.result.forEach(function (instance: any) {
                var instance_string = JSON.stringify(instance);
                map[instance_string] = true;
            })
        });
        nested_filter_result.champData.forEach(function (instance: any) {
            var instance_string = JSON.stringify(instance);
            map[instance_string] = false;
        });
        var mapkey = Object.keys(map);
        mapkey.forEach(function (key: any) {
            if (map[key] == true)
                filtered_data.champData.push(JSON.parse(key));

        });
        return filtered_data;
    }
}

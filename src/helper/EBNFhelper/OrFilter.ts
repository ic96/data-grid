import LeagueFilterHelper from "./LeagueFilterHelper";
/**
 * Created by Ian on 2017-08-08.
 */

export default class OrFilter{

    public static EBNF_OR(where: any, id:string, championData: any ): any {

        var EBNF = Object.keys(where)[0];

        var filtered_data = {champData: new Array()};
        var filter = where[EBNF];
        var filtered_result = LeagueFilterHelper.EBNFTranslator(filter[0], id, championData);
        // iterate through inner filter
        for (var i = 1; i < filter.length; i++) {
            var map: any = {};
            var second_result = LeagueFilterHelper.EBNFTranslator(filter[i], id, championData);
            filtered_result.champData.forEach(function (instance: any) {
                var instance_string = JSON.stringify(instance);
                map[instance_string] = true;
            });
            second_result.champData.forEach(function (instance: any) {
                var instance_string = JSON.stringify(instance);
                map[instance_string] = true;
            });
            Object.keys(map).forEach(function (key: any) {
                filtered_data.champData.push(JSON.parse(key));
            })
        }
        return filtered_data;
    }
}
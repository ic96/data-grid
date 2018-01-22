import LeagueFilterHelper from "./LeagueFilterHelper";
/**
 * Created by Ian on 2017-08-08.
 */

export default class AndFilter {

    public static EBNF_AND(where: any, id: string, championData: any): any {
        var where_filter = Object.keys(where)[0];
        var filter = where[where_filter];
        var filtered_result = LeagueFilterHelper.EBNFTranslator(filter[0], id, championData);
        var result;
        // iterate through inner filter
        for (var i = 1; i < filter.length; i++) {
            var map: any = {};
            var finalresult: any = {champData: new Array()};

            var second_result = LeagueFilterHelper.EBNFTranslator(filter[i], id, championData);
            filtered_result.champData.forEach(function (instance: any) {
                var instance_string = JSON.stringify(instance);
                map[instance_string] = false;
            });
            second_result.champData.forEach(function (instance: any) {
                var instance_string = JSON.stringify(instance);
                if (map[instance_string] == false) {
                    map[instance_string] = true;
                }
            });
            Object.keys(map).forEach(function (key: any) {
                if (map[key] == true) {
                    finalresult.champData.push(JSON.parse(key));
                }
            });
            filtered_result = finalresult;

        }
        return filtered_result;
    }
}

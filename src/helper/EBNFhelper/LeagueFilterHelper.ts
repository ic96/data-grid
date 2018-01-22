import OrFilter from "./OrFilter";
import AndFilter from "./AndFilter";
import CompareFilters from "./CompareFilters";
import IsFilter from "./IsFilter";
import NotFilter from "./NotFilter";
/**
 * Created by Ian on 2017-08-08.
 */

export default class LeagueFilterHelper{

    public static EBNFTranslator(where: any, id: string, championData: any) {
        let dataObject: any;
        dataObject = { champData: championData };
        // if {} then filtered_courses is every file
        if (Object.keys(where).length == 0) {
            var filtered_data1 = {champData: new Array()};
            dataObject.champData.forEach(function (value: any) {
                value.result.forEach(function (instance: any) {
                    filtered_data1.champData.push(instance);
                });
            });
            return filtered_data1;
        }
        // logical filters inside where
        var where_filter = Object.keys(where)[0];
        var filtered_results = {champData: new Array()};
        switch (where_filter) {
            case "OR":
                filtered_results = OrFilter.EBNF_OR(where, id, championData);
                break;
            case "AND":
                filtered_results = AndFilter.EBNF_AND(where, id, championData);
                break;
            case "GT":
                filtered_results = CompareFilters.EBNF_GT(where, id, championData, dataObject);
                break;
            case "EQ":
                filtered_results = CompareFilters.EBNF_EQ(where, id, championData, dataObject);
                break;
            case "LT":
                filtered_results = CompareFilters.EBNF_LT(where, id, championData, dataObject);
                break;

            case "IS":
                filtered_results = IsFilter.EBNF_IS(where, id, championData, dataObject);
                break;

            case "NOT":
                filtered_results = NotFilter.EBNF_NOT(where, id, championData, dataObject);
                break;

            default:
                return filtered_results;

        }
        return filtered_results;
    }

}

/**
 * Created by Ian on 2017-08-08.
 */
export default class ColumnsHelper{

    public static sortColumn(order: string, data: any) {
        var result: any = {};
        let that = this;
        result = data;

        result.champData.sort((object1: any, object2: any) => {
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

    public static filterCol(column: any, results: any): any {
        let i = 0;
        results.champData.forEach(function (object: any) {

            let filteredobj: any = {};
            column.forEach(function (id: string) {
                let JSONkey = object[id];
                filteredobj[id] = JSONkey;
            });
            object = filteredobj;
            results.champData[i] = object;
            i++;

        });
        return results;
    }

    public static validField(field: string| string[], column: string[], id: string){
        if (field == "string") {
            // returns id
            id = field;
            column.push(field);
        } else
            (<string[]> field).forEach(function (element) {
                // element = key
                // adds element from query.columns to columns
                column.push(element);
            });
    }
}
/**
 * Created by Ian on 2017-08-08.
 */

export default class ApplyHelper{

    public static applyResults(apply: any, set: any) {
        let that = this;
        let filter_result = {champData: new Array()};
        Object.keys(set).forEach(function (termInstance: any) {
            let setItems = set[termInstance];
            let item: any = {};
            apply.forEach(function (term: any) {

                let id = Object.keys(term)[0];
                item[id] = this.applyTerms(term[id], setItems);
            });
            filter_result.champData.push(item);
        });
        return filter_result;
    }


    public applyTerms(termKey: any, setInstance: any) {
        let that = this;
        var applyToken = Object.keys(termKey)[0];
        let result: any;
        let term = termKey[applyToken];
        switch (applyToken) {
            case "MIN":
                let minimum = Number.MAX_SAFE_INTEGER;
                setInstance.forEach(function (item: any) {
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
                setInstance.forEach(function (item: any) {
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
                setInstance.forEach(function (item: any) {
                    if (typeof item[term] == "number") {
                        average += item[term];
                    } else throw{
                        code: 400,
                        message: item[term] + "is not a number"
                    }
                });

                result = (average / setInstance.length).toFixed(2);

                break;
            case "COUNT":
                var count = 0;
                let items: any = {};
                setInstance.forEach(function (item: any) {
                    let value = item[term];

                    if (!items[value]) {
                        items[value] = true;
                        count++;

                    }
                });

                result = count;
                break;
            case "SUM":
                var sum = 0;
                setInstance.forEach(function (item: any) {
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
        }
        return Number(result);

    }
}

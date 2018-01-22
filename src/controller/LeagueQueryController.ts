/**
 * Created by Ian on 2017-07-03.
 */

import {Datasets, default as InsightFacade} from "./InsightFacade";
import {QueryRequest} from "./IInsightFacade";
import {stringify} from "querystring";
import LeagueFilterHelper from "../helper/EBNFhelper/LeagueFilterHelper";
import ApplyHelper from "../helper/ApplyHelper";
import ColumnsHelper from "../helper/ColumnsHelper";


export interface QueryBody {
    body: any;
    missing: string[];
}

export default class LeagueQueryController {
    private insight: InsightFacade;


    constructor(insight: InsightFacade) {
        this.insight = insight;
    }

    public invalidQuery(query: QueryRequest): boolean {
        return (!query.TRANSFORMATIONS.APPLY)
    }

    public query(query: QueryRequest): QueryBody {
        if (!query.TRANSFORMATIONS) {
            return this.getResult(query.WHERE, query.OPTIONS.ORDER, query.OPTIONS.FORM, query.OPTIONS.COLUMNS);
        } else if (this.invalidQuery(query)) {
            throw{
                code: 400,
                message: "Apply not found"
            }
        }

        return this.getResult(query.WHERE, query.OPTIONS.ORDER, query.OPTIONS.FORM, query.OPTIONS.COLUMNS,
            query.TRANSFORMATIONS.APPLY);
    }

    public orderDir(keys: string[], direction: string, data: any) {
        var result: any = {};
        result = data;

        let transKey: string[] = [];
        keys.forEach(function (key: any) {
            transKey.push(key);
        });
        var same = -1;
        var change = 1;
        if (direction == "DOWN") {
            change = -1;
            same = 1;
        }
        result.champData.sort((number1: any, number2: any) => {

            var value = 0;
            var key: string;
            for (let i = 0; i < transKey.length; i++) {
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
    }

    public getResult(where: any, order: any, form: any, field: string | string[], apply?: any): any {
        var column: string[] = [];
        var data: any;
        var id: string;

        ColumnsHelper.validField(field, column, id);

        data = this.insight.getDataset("LoLData");
        if (!data) {
            return {missing: id};
        }
        var result = LeagueFilterHelper.EBNFTranslator(where, "LoLData", data);

        if (apply ) {
            result = ApplyHelper.applyResults(apply, result);
        }
        if (column.length > 0) {
            result = ColumnsHelper.filterCol(column, result);
        }
        if (order) {
            if (order.keys) {
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
            if (typeof order == "string") {
                    result = ColumnsHelper.sortColumn(order, result);
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
        if (form !== "TABLE") {
            throw{
                code: 400,
                message: "Invalid FORM"
            }
        }
        return {
            body: {
                "render": form,
                "result": result.champData
            }
        }
    }
}
/*
/!**
 * Created by ms076 on 2017-02-06.
 *!/
/!**
 * Created by ms076 on 2017-01-21.
 *!/

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import QueryRequest from "../src/controller/InsightFacade";

describe("query", function () {
    var insight: InsightFacade = null;
    var query: QueryRequest = null;

    beforeEach(function () {
        insight = new InsightFacade;
        query = new QueryRequest;
    });

    afterEach(function () {
        insight = null;
        query = null;
    });

    it("given courses file, return file content, code 204", function () {
        /!*console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('courses.zip');
        var response: InsightResponse = {code: 204, body: {}};

        return insight.addDataset('courses', content).then(function (value) {
            console.log('sup: '+JSON.stringify(value));
            //console.log("print addDataset fulfill value " + value);
            expect(value).to.not.equal('');
            expect(value).to.not.equal(' ');
            expect(value).to.not.be.an('undefined');
            expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Log.test('Error: '+err);
            expect.fail();
        });*!/
        var where = {
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var data = insight.getDataset('courses');
        console.log('data' + data);
        var response = insight.EBNFTranslator(where, 'courses', data);

        console.log(response);

    });


});*/

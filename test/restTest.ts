/**
 * Created by ms076 on 2017-02-25.
 */
/**
 * Created by ms076 on 2017-01-21.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import {Response} from "restify";
import {App} from "../src/App";


describe("addDataset", function () {
    var fs = require('fs');
    var chai = require('chai');
   // chai.use(require('chai-http'));

    var insight: InsightFacade = null;
    before(function () {
        /*var app = new App();
        app.initServer(4321);*/
        let s = new Server(4321);
        s.start().then(function (val: boolean) {
            Log.info("App::initServer() - started: " + val);
        }).catch(function (err: Error) {
            Log.error("App::initServer() - ERROR: " + err.message);
        });
    })

    beforeEach(function () {
        insight = new InsightFacade;

    });

    afterEach(function () {
        insight = null;
    });

    it("PUT description", function () {
        return chai.request("http://localhost:4321")
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
            .then(function (res: Response) {
                Log.trace('then:');
                // some assertions
                //console.log(res);
                //expect(res).to.have.status(200);
                expect(res.status).to.be.equal(204);
            })
            .catch(function (err: any) {
                Log.trace('catch:');
                console.log(err.message);
                // some assertions
                expect.fail();

            });
    });


    it("DELETE description", function () {
        return chai.request("http://localhost:4321")
            .del('/dataset/rooms')
            .then(function (res: Response) {
                Log.trace('then:');
                // some assertions
                //console.log(res);
                //expect(res).to.have.status(200);
                //expect(res.status).to.be.equal(204);
            })
            .catch(function (err: any) {
                Log.trace('catch:');
                console.log(err.message);
                // some assertions
                expect.fail();

            });
    });

/*
    it("POST description", function () {
        let query = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        return chai.request("http://localhost:4321")
            .post('/query')
            .send(query)
            .then(function (res: Response) {
                Log.trace('then:');
                // some assertions
                //console.log(res);
            })
            .catch(function (err: any) {
                Log.trace(err);
                // some assertions
                console.log(err.message);
                expect.fail();
            });
    });
    */


});

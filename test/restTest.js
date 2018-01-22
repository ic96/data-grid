"use strict";
var Server_1 = require("../src/rest/Server");
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
describe("addDataset", function () {
    var fs = require('fs');
    var chai = require('chai');
    var insight = null;
    before(function () {
        var s = new Server_1.default(4321);
        s.start().then(function (val) {
            Util_1.default.info("App::initServer() - started: " + val);
        }).catch(function (err) {
            Util_1.default.error("App::initServer() - ERROR: " + err.message);
        });
    });
    beforeEach(function () {
        insight = new InsightFacade_1.default;
    });
    afterEach(function () {
        insight = null;
    });
    it("PUT description", function () {
        return chai.request("http://localhost:4321")
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
            .then(function (res) {
            Util_1.default.trace('then:');
            chai_1.expect(res.status).to.be.equal(204);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:');
            console.log(err.message);
            chai_1.expect.fail();
        });
    });
    it("DELETE description", function () {
        return chai.request("http://localhost:4321")
            .del('/dataset/rooms')
            .then(function (res) {
            Util_1.default.trace('then:');
        })
            .catch(function (err) {
            Util_1.default.trace('catch:');
            console.log(err.message);
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=restTest.js.map
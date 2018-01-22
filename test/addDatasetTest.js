"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var chai = require("chai");
describe("addDataset", function () {
    var insight = null;
    before(function () {
        Util_1.default.test('Before: all in adddataset');
    });
    beforeEach(function () {
        insight = new InsightFacade_1.default;
    });
    afterEach(function () {
        insight = null;
    });
    after(function () {
        Util_1.default.test('After: all in adddataset');
    });
    it("given champData file, return file content, code 204", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('rooms.zip');
        var response = { code: 204, body: {} };
        return insight.addDataset('rooms', content).then(function (value) {
            chai_1.expect(value).to.not.equal('');
            chai_1.expect(value).to.not.equal(' ');
            chai_1.expect(value).to.not.be.an('undefined');
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("given a file already cached, return file content, code 201", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('champData.zip');
        var response = { code: 201, body: {} };
        return insight.addDataset('champData', content).then(function (value) {
            console.log('sup: ' + JSON.stringify(value));
            return insight.addDataset('champData', content);
        }).then(function (value) {
            console.log("201 adddataset" + JSON.stringify(value));
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("zip with one file with invalid json", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('courses1.zip');
        var response = { code: 204, body: {} };
        return insight.addDataset('champData', content).then(function (value) {
            console.log('sup: ' + JSON.stringify(value));
            chai_1.expect(value).to.not.equal('');
            chai_1.expect(value).to.not.equal(' ');
            chai_1.expect(value).to.not.be.an('undefined');
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("given invalid file id, return code 400", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('test.zip');
        var response = { code: 400, body: { "error": "The zip id does not exist" } };
        return insight.addDataset('champData', content).then(function (value) {
            Util_1.default.test('value:' + value);
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(JSON.stringify(err)).to.equals(JSON.stringify(response));
        });
    });
    it("given invalid file type, return code 400", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('hello.txt');
        var response = { code: 400, body: { "error": "The zip id does not exist" } };
        return insight.addDataset('champData', content).then(function (value) {
            Util_1.default.test('value:' + value);
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(JSON.stringify(err)).to.equals(JSON.stringify(response));
        });
    });
    it("given empty zip file, return code 400", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('coursesempty.zip');
        var response = { code: 400, body: { "error": "File content could not be parsed" } };
        return insight.addDataset('champData', content).then(function (value) {
            Util_1.default.test('value:' + value);
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(JSON.stringify(err)).to.equals(JSON.stringify(response));
        });
    });
    it("given zip with random stuff, return code 400", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('ziprandomstuff.zip');
        var response = { code: 400, body: { "error": "" } };
        return insight.addDataset('champData', content).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            console.log('JSON.stringify(err)' + JSON.stringify(err));
            Util_1.default.test('Error: ' + err);
            chai_1.expect(JSON.stringify(err)).to.equals(JSON.stringify(response));
        });
    });
    it("given zip with jpg, return code 400", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('coursesimg.zip');
        var response = { code: 400, body: { "error": "File content could not be parsed" } };
        return insight.addDataset('champData', content).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            console.log('JSON.stringify(err)' + JSON.stringify(err));
            Util_1.default.test('Error: ' + err);
            chai_1.expect(JSON.stringify(err)).to.equals(JSON.stringify(response));
        });
    });
    it("given zip with only invalid json files, return code 400", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('coursesInvalid.zip');
        var response = { code: 400, body: { "error": "File content could not be parsed" } };
        return insight.addDataset('champData', content).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            console.log('JSON.stringify(err)' + JSON.stringify(err));
            Util_1.default.test('Error: ' + err);
            chai_1.expect(JSON.stringify(err)).to.equals(JSON.stringify(response));
        });
    });
    it("add first then remove gives 204", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('champData.zip');
        var response = { code: 204, body: {} };
        return insight.addDataset('champData', content).then(function (value) {
            return insight.removeDataset('champData');
        }).then(function (value) {
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("add first then clear cache then remove 204", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('champData.zip');
        var response = { code: 204, body: {} };
        return insight.addDataset('champData', content).then(function (value) {
            insight.clearCache('champData');
            return insight.removeDataset('champData');
        }).then(function (value) {
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("add first then clear disk then remove 204", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('champData.zip');
        var response = { code: 204, body: {} };
        return insight.addDataset('champData', content).then(function (value) {
            insight.clearDisk('champData');
            return insight.removeDataset('champData');
        }).then(function (value) {
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("cache is empty but disk is not, 204", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('champData.zip');
        var response = { code: 204, body: {} };
        return insight.addDataset('champData', content).then(function (value) {
            console.log('sup: ' + JSON.stringify(value));
            insight.clearCache('champData');
            return insight.removeDataset('champData');
        }).then(function (value) {
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("add first then remove then remove again gives 404", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('champData.zip');
        var response = {
            code: 404,
            body: { "error": "The dataset you are trying to delete was not previously added" }
        };
        return insight.addDataset('champData', content).then(function (value) {
            console.log('sup: ' + JSON.stringify(value));
            return insight.removeDataset('champData');
        }).then(function (value) {
            return insight.removeDataset('champData');
        }).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            console.log(JSON.stringify(response));
            chai_1.expect(JSON.stringify(err)).to.equals(JSON.stringify(response));
        });
    });
    it("performQuery on simple query", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
            chai_1.expect(response.body).to.deep.equal({
                render: 'TABLE',
                result: [{ courses_dept: 'epse', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.09 },
                    { courses_dept: 'epse', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.25 },
                    { courses_dept: 'math', courses_avg: 97.25 },
                    { courses_dept: 'epse', courses_avg: 97.29 },
                    { courses_dept: 'epse', courses_avg: 97.29 },
                    { courses_dept: 'nurs', courses_avg: 97.33 },
                    { courses_dept: 'nurs', courses_avg: 97.33 },
                    { courses_dept: 'epse', courses_avg: 97.41 },
                    { courses_dept: 'epse', courses_avg: 97.41 },
                    { courses_dept: 'cnps', courses_avg: 97.47 },
                    { courses_dept: 'cnps', courses_avg: 97.47 },
                    { courses_dept: 'math', courses_avg: 97.48 },
                    { courses_dept: 'math', courses_avg: 97.48 },
                    { courses_dept: 'educ', courses_avg: 97.5 },
                    { courses_dept: 'nurs', courses_avg: 97.53 },
                    { courses_dept: 'nurs', courses_avg: 97.53 },
                    { courses_dept: 'epse', courses_avg: 97.67 },
                    { courses_dept: 'epse', courses_avg: 97.69 },
                    { courses_dept: 'epse', courses_avg: 97.78 },
                    { courses_dept: 'crwr', courses_avg: 98 },
                    { courses_dept: 'crwr', courses_avg: 98 },
                    { courses_dept: 'epse', courses_avg: 98.08 },
                    { courses_dept: 'nurs', courses_avg: 98.21 },
                    { courses_dept: 'nurs', courses_avg: 98.21 },
                    { courses_dept: 'epse', courses_avg: 98.36 },
                    { courses_dept: 'epse', courses_avg: 98.45 },
                    { courses_dept: 'epse', courses_avg: 98.45 },
                    { courses_dept: 'nurs', courses_avg: 98.5 },
                    { courses_dept: 'nurs', courses_avg: 98.5 },
                    { courses_dept: 'epse', courses_avg: 98.58 },
                    { courses_dept: 'nurs', courses_avg: 98.58 },
                    { courses_dept: 'nurs', courses_avg: 98.58 },
                    { courses_dept: 'epse', courses_avg: 98.58 },
                    { courses_dept: 'epse', courses_avg: 98.7 },
                    { courses_dept: 'nurs', courses_avg: 98.71 },
                    { courses_dept: 'nurs', courses_avg: 98.71 },
                    { courses_dept: 'eece', courses_avg: 98.75 },
                    { courses_dept: 'eece', courses_avg: 98.75 },
                    { courses_dept: 'epse', courses_avg: 98.76 },
                    { courses_dept: 'epse', courses_avg: 98.76 },
                    { courses_dept: 'epse', courses_avg: 98.8 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'cnps', courses_avg: 99.19 },
                    { courses_dept: 'math', courses_avg: 99.78 },
                    { courses_dept: 'math', courses_avg: 99.78 }]
            });
        }).catch(function (error) {
            Util_1.default.test('Error: ' + JSON.stringify(error));
            chai_1.expect.fail();
        });
    });
    it("performQuery on complex query", function () {
        var query = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 90
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        })
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
            chai_1.expect(response.body).to.deep.equal({
                render: 'TABLE',
                result: [{ courses_dept: 'adhe', courses_id: '329', courses_avg: 90.02 },
                    { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.16 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.17 },
                    { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.18 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.5 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.72 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.82 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.85 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.29 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.48 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 92.54 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 93.33 },
                    { courses_dept: 'rhsc', courses_id: '501', courses_avg: 95 },
                    { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
                    { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
                    { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
                    { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
                    { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
                    { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'sowk', courses_id: '570', courses_avg: 95 },
                    { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
                    { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
                    { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
                    { courses_dept: 'epse', courses_id: '606', courses_avg: 95 },
                    { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
                    { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
                    { courses_dept: 'kin', courses_id: '499', courses_avg: 95 },
                    { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
                    { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
                    { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
                    { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
                    { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
                    { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
                    { courses_dept: 'mtrl', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
                    { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
                    { courses_dept: 'obst', courses_id: '549', courses_avg: 95 },
                    { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
                    { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
                    { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 96.11 }]
            });
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery on NOT", function () {
        var query = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "courses_avg": 50
                    }
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
            chai_1.expect(response.body).to.deep.equal({
                render: 'TABLE',
                result: [{ courses_dept: 'frst', courses_avg: 0 },
                    { courses_dept: 'lfs', courses_avg: 0 },
                    { courses_dept: 'lfs', courses_avg: 0 },
                    { courses_dept: 'wood', courses_avg: 1 },
                    { courses_dept: 'busi', courses_avg: 4 },
                    { courses_dept: 'busi', courses_avg: 4 },
                    { courses_dept: 'fopr', courses_avg: 4.5 },
                    { courses_dept: 'civl', courses_avg: 33 },
                    { courses_dept: 'phil', courses_avg: 33.2 },
                    { courses_dept: 'hist', courses_avg: 34 },
                    { courses_dept: 'educ', courses_avg: 39.03 },
                    { courses_dept: 'educ', courses_avg: 39.03 },
                    { courses_dept: 'chbe', courses_avg: 42 },
                    { courses_dept: 'chem', courses_avg: 42.5 },
                    { courses_dept: 'busi', courses_avg: 42.64 },
                    { courses_dept: 'busi', courses_avg: 42.64 },
                    { courses_dept: 'psyc', courses_avg: 43.33 },
                    { courses_dept: 'chbe', courses_avg: 44.88 },
                    { courses_dept: 'hist', courses_avg: 46.33 },
                    { courses_dept: 'hist', courses_avg: 46.33 },
                    { courses_dept: 'busi', courses_avg: 46.5 },
                    { courses_dept: 'math', courses_avg: 46.52 },
                    { courses_dept: 'frst', courses_avg: 46.59 },
                    { courses_dept: 'comm', courses_avg: 46.71 },
                    { courses_dept: 'busi', courses_avg: 46.95 },
                    { courses_dept: 'hist', courses_avg: 47.13 },
                    { courses_dept: 'lled', courses_avg: 47.29 },
                    { courses_dept: 'lled', courses_avg: 47.82 },
                    { courses_dept: 'lled', courses_avg: 48.9 },
                    { courses_dept: 'comm', courses_avg: 49.07 },
                    { courses_dept: 'frst', courses_avg: 49.14 },
                    { courses_dept: 'hist', courses_avg: 49.15 },
                    { courses_dept: 'busi', courses_avg: 49.17 },
                    { courses_dept: 'civl', courses_avg: 49.25 },
                    { courses_dept: 'busi', courses_avg: 49.47 },
                    { courses_dept: 'busi', courses_avg: 49.47 },
                    { courses_dept: 'lled', courses_avg: 49.73 },
                    { courses_dept: 'lled', courses_avg: 49.86 },
                    { courses_dept: 'math', courses_avg: 49.95 },
                    { courses_dept: 'chbe', courses_avg: 50 },
                    { courses_dept: 'busi', courses_avg: 50 },
                    { courses_dept: 'psyc', courses_avg: 50 }]
            });
        }).catch(function (error) {
            Util_1.default.test('Error: ' + JSON.stringify(error));
            chai_1.expect.fail();
        });
    });
    it("performQuery on IS", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_dept": "astu"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal({
                "render": "TABLE", "result": [{ "courses_dept": "astu", "courses_avg": 63.14 },
                    { "courses_dept": "astu", "courses_avg": 64.75 }, { "courses_dept": "astu", "courses_avg": 64.75 },
                    { "courses_dept": "astu", "courses_avg": 65.37 }, { "courses_dept": "astu", "courses_avg": 65.74 },
                    { "courses_dept": "astu", "courses_avg": 65.8 }, { "courses_dept": "astu", "courses_avg": 65.8 },
                    { "courses_dept": "astu", "courses_avg": 65.85 }, { "courses_dept": "astu", "courses_avg": 65.92 },
                    { "courses_dept": "astu", "courses_avg": 66.93 }, { "courses_dept": "astu", "courses_avg": 66.93 },
                    { "courses_dept": "astu", "courses_avg": 67.22 }, { "courses_dept": "astu", "courses_avg": 67.22 },
                    { "courses_dept": "astu", "courses_avg": 67.4 }, { "courses_dept": "astu", "courses_avg": 68.32 },
                    { "courses_dept": "astu", "courses_avg": 68.32 }, { "courses_dept": "astu", "courses_avg": 68.6 },
                    { "courses_dept": "astu", "courses_avg": 68.6 }, { "courses_dept": "astu", "courses_avg": 68.96 },
                    { "courses_dept": "astu", "courses_avg": 69.38 }, { "courses_dept": "astu", "courses_avg": 69.38 },
                    { "courses_dept": "astu", "courses_avg": 69.39 }, { "courses_dept": "astu", "courses_avg": 69.77 },
                    { "courses_dept": "astu", "courses_avg": 69.98 }, { "courses_dept": "astu", "courses_avg": 70.03 },
                    { "courses_dept": "astu", "courses_avg": 70.03 }, { "courses_dept": "astu", "courses_avg": 70.3 },
                    { "courses_dept": "astu", "courses_avg": 70.3 }, { "courses_dept": "astu", "courses_avg": 70.43 },
                    { "courses_dept": "astu", "courses_avg": 70.43 }, { "courses_dept": "astu", "courses_avg": 70.82 },
                    { "courses_dept": "astu", "courses_avg": 71.25 }, { "courses_dept": "astu", "courses_avg": 71.25 },
                    { "courses_dept": "astu", "courses_avg": 71.44 }, { "courses_dept": "astu", "courses_avg": 73.54 },
                    { "courses_dept": "astu", "courses_avg": 73.54 }, { "courses_dept": "astu", "courses_avg": 78 },
                    { "courses_dept": "astu", "courses_avg": 78 }, { "courses_dept": "astu", "courses_avg": 79.63 },
                    { "courses_dept": "astu", "courses_avg": 79.63 }, { "courses_dept": "astu", "courses_avg": 80.13 },
                    { "courses_dept": "astu", "courses_avg": 80.13 }, { "courses_dept": "astu", "courses_avg": 80.17 },
                    { "courses_dept": "astu", "courses_avg": 80.17 }, { "courses_dept": "astu", "courses_avg": 81 },
                    { "courses_dept": "astu", "courses_avg": 81 }, { "courses_dept": "astu", "courses_avg": 81 },
                    { "courses_dept": "astu", "courses_avg": 81 }, { "courses_dept": "astu", "courses_avg": 82.5 },
                    { "courses_dept": "astu", "courses_avg": 82.5 }, { "courses_dept": "astu", "courses_avg": 83.14 },
                    { "courses_dept": "astu", "courses_avg": 83.14 }]
            });
        }).catch(function (error) {
            Util_1.default.test('Error: ' + JSON.stringify(error));
            chai_1.expect.fail();
        });
    });
    it("performQuery invalid ORDER", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_dept": "astu"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_instructor",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.code);
            chai_1.expect(response.code).to.equal(200);
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery invalid id result in 424", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_dept": "astu"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "coures_dept",
                    "coures_avg"
                ],
                "ORDER": "coures_avg",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.code);
            chai_1.expect(response.code).to.equal(200);
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            console.log(rejectResponse.code);
            chai_1.expect(rejectResponse.code).to.equal(424);
        });
    });
    it("performQuery invalid translate = 400", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_dept": "astu"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_av",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.code);
            chai_1.expect(response.code).to.equal(200);
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery 70 < avg < 80", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "courses_dept": "astu"
                        }
                    },
                    {
                        "NOT": {
                            "IS": {
                                "courses_dept": "astu"
                            }
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_dept",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.body);
            chai_1.expect(response.body).to.equal(response.body);
        });
    });
    it("performQuery on no ORDER instructor", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "friedman*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_instructor"
                ],
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.body);
            chai_1.expect(response.body).to.equal(response.body);
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect.fail();
        });
    });
    it("performQuery on no ORDER instructor", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "friedman*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_instructor"
                ],
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.body);
            chai_1.expect(response.body).to.equal(response.body);
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery contradictory query", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "GT": {
                            "courses_avg": 99
                        }
                    },
                    {
                        "NOT": {
                            "GT": {
                                "courses_avg": 99
                            }
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
            chai_1.expect(response.body).to.equal(response.body);
        }, function (rejectResponse) {
            console.log(rejectResponse.code);
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery more than 2  filters query", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "GT": {
                            "courses_avg": 70
                        }
                    },
                    {
                        "GT": {
                            "courses_avg": 90
                        }
                    },
                    { "LT": {
                            "courses_avg": 90
                        } }, { "LT": {
                            "courses_avg": 100
                        } }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
            chai_1.expect(response.body).to.equal(response.body);
        }, function (rejectResponse) {
            console.log(rejectResponse.code);
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery more than 2  filters query", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "courses_avg": 70
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
            chai_1.expect(response.body).to.equal(response.body);
        }, function (rejectResponse) {
            console.log(rejectResponse.code);
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery no ORDER", function () {
        var query = { "WHERE": {
                "AND": [
                    {
                        "GT": {
                            "courses_avg": 60
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.body);
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.equal(response.body);
        }, function (rejectResponse) {
            console.log(rejectResponse.code);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
});
//# sourceMappingURL=addDatasetTest.js.map
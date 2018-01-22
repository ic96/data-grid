"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
describe("getRoomsList", function () {
    var insight = null;
    beforeEach(function () {
        insight = new InsightFacade_1.default;
    });
    afterEach(function () {
        insight = null;
    });
    it("test rooms.zip", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('rooms.zip');
        var response = { code: 204, body: {} };
        return insight.addDataset('rooms', content).then(function (value) {
            console.log('sup: ' + JSON.stringify(value));
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("add first then remove gives 204", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('rooms.zip');
        var response = { code: 204, body: {} };
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.removeDataset('rooms');
        }).then(function (value) {
            chai_1.expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("invalid id return 400", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('invalid.zip');
        var response = { code: 400, body: {} };
        return insight.addDataset('champData', content).then(function (value) {
            console.log('sup: ' + JSON.stringify(value));
            chai_1.expect.fail();
        }).catch(function (err) {
            chai_1.expect(err.code).to.equals(response.code);
            Util_1.default.test('Error: ' + err);
        });
    });
    it("performQuery on IS", function () {
        var query = {
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
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log("response body: " + response.body);
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal({
                "render": "TABLE",
                "result": [{
                        "rooms_name": "DMP_101"
                    }, {
                        "rooms_name": "DMP_110"
                    }, {
                        "rooms_name": "DMP_201"
                    }, {
                        "rooms_name": "DMP_301"
                    }, {
                        "rooms_name": "DMP_310"
                    }]
            });
        }).catch(function (error) {
            Util_1.default.test('Error: ' + JSON.stringify(error));
            chai_1.expect.fail();
        });
    });
    it("remove then add then query should work", function () {
        var query = {
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
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.removeDataset('rooms');
        }).then(function (value) {
            return insight.addDataset('rooms', content);
        }).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log("response body: " + response.body);
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal({
                "render": "TABLE",
                "result": [{
                        "rooms_name": "DMP_101"
                    }, {
                        "rooms_name": "DMP_110"
                    }, {
                        "rooms_name": "DMP_201"
                    }, {
                        "rooms_name": "DMP_301"
                    }, {
                        "rooms_name": "DMP_310"
                    }]
            });
        }).catch(function (error) {
            Util_1.default.test('Error: ' + JSON.stringify(error));
            chai_1.expect.fail();
        });
    });
    it("query room type", function () {
        var query2 = {
            "WHERE": {
                "IS": {
                    "rooms_type": "Small Group"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_shortname",
                    "rooms_fullname",
                    "rooms_number",
                    "rooms_address",
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_seats",
                    "rooms_type",
                    "rooms_furniture",
                    "rooms_href"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query2);
        }).then(function (response) {
            console.log("response body rooms_type: " + JSON.stringify(response.body));
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(response.body);
        });
    });
    it("query specific room", function () {
        var query2 = {
            "WHERE": {
                "IS": {
                    "rooms_name": "ANGU_292"
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
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query2);
        }).then(function (response) {
            console.log("response body: " + JSON.stringify(response.body));
            chai_1.expect(response.code).to.equal(200);
        });
    });
    it("query order by url", function () {
        var query2 = {
            "WHERE": {
                "IS": {
                    "rooms_type": "Small Group"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_href"
                ],
                "ORDER": "rooms_href",
                "FORM": "TABLE"
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query2);
        }).then(function (response) {
            console.log("response body: " + JSON.stringify(response.body));
            chai_1.expect(response.code).to.equal(200);
        });
    });
    it("query group simple query A", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.body);
            chai_1.expect(response.body).to.deep.equal({
                "render": "TABLE",
                "result": [{
                        "rooms_shortname": "OSBO",
                        "maxSeats": 442
                    }, {
                        "rooms_shortname": "HEBB",
                        "maxSeats": 375
                    }, {
                        "rooms_shortname": "LSC",
                        "maxSeats": 350
                    }]
            });
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery runs on Query A for D3", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    },
                    {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal({ "render": "TABLE", "result": [{ "rooms_shortname": "LSC", "maxSeats": 350 }, { "rooms_shortname": "HEBB", "maxSeats": 375 }, { "rooms_shortname": "OSBO", "maxSeats": 442 }] });
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery runs on SUM, MIN, COUNT, AVG", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "minSeats",
                    "maxSeats",
                    "sumSeats",
                    "countRooms",
                    "avgSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["minSeats", "sumSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } },
                    { "maxSeats": { "MAX": "rooms_seats" } },
                    { "sumSeats": { "SUM": "rooms_seats" } },
                    { "countRooms": { "COUNT": "rooms_name" } },
                    { "avgSeats": { "AVG": "rooms_seats" } }]
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
            chai_1.expect(response.body).to.deep.equal(response.body);
        }, function (rejectResponse) {
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery runs on Query B for D3", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal({ "render": "TABLE",
                "result": [{ "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs" },
                    { "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs" },
                    { "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs" },
                    { "rooms_furniture": "Classroom-Fixed Tablets" },
                    { "rooms_furniture": "Classroom-Hybrid Furniture" },
                    { "rooms_furniture": "Classroom-Learn Lab" },
                    { "rooms_furniture": "Classroom-Movable Tables & Chairs" },
                    { "rooms_furniture": "Classroom-Movable Tablets" },
                    { "rooms_furniture": "Classroom-Moveable Tables & Chairs" },
                    { "rooms_furniture": "Classroom-Moveable Tablets" }] });
        }).catch(function (error) {
            Util_1.default.trace(JSON.stringify(error));
            chai_1.expect.fail();
        });
    });
    it("performQuery fails with empty GROUP", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [],
                "APPLY": []
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err.body['error']);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.deep.equal({ "error": "Empty group" });
        });
    });
    it("performQuery should pass with empty APPLY", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        };
        return insight.performQuery(query).then(function (response) {
            console.log(response.body);
            chai_1.expect(response.code).to.equal(200);
        }).catch(function (err) {
            chai_1.expect(err.code).to.equal(400);
        });
    });
    it("performQuery fails with invalid ORDER direction", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": {
                    "dir": "INVALID",
                    "keys": ["rooms_furniture"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        };
        return insight.performQuery(query).then(function (response) {
            console.log(response.body);
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err.body['error']);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.deep.equal({ "error": "Invalid direction" });
        });
    });
    it("performQuery order in neither group nor apply", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["rooms_seats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        };
        return insight.performQuery(query).then(function (response) {
            console.log(response.body);
            chai_1.expect(response.code).to.equal(200);
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery fails with invalid APPLY key", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    },
                    {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "max_Seats"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["max_Seats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "max_Seats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        return insight.performQuery(query).then(function (response) {
            console.log(response.body);
        }, function (rejectResponse) {
            console.log(rejectResponse.code);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery fails with invalid APPLYTOKEN", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    },
                    {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "INVALID": "rooms_seats"
                        }
                    }]
            }
        };
        return insight.performQuery(query).then(function (response) {
            console.log(response.body);
            console.log(response.code);
        }, function (rejectResponse) {
            chai_1.expect(rejectResponse.code).to.equal(400);
            console.log(rejectResponse.body);
        });
    });
    it("performQuery MIN test invalid", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "minSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["countSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query).then(function (response) {
                chai_1.expect(response.code).to.equal(200);
                console.log(response.body);
                chai_1.expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse) {
                console.log(rejectResponse.code);
                console.log(rejectResponse.body);
                chai_1.expect(rejectResponse.code).to.equal(400);
            });
        });
    });
    it("performQuery MIN test valid", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "minSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["minSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query).then(function (response) {
                chai_1.expect(response.code).to.equal(200);
                console.log(response.body);
                chai_1.expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse) {
                console.log(rejectResponse.code);
                console.log(rejectResponse.body);
                chai_1.expect.fail("should not go here");
            });
        });
    });
    it("performQuery COUNT", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "countSeats", "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["countSeats", "rooms_seats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_seats"],
                "APPLY": [{ "countSeats": { "COUNT": "rooms_seats" } }]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query).then(function (response) {
                chai_1.expect(response.code).to.equal(200);
                console.log(response.body);
                chai_1.expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse) {
                console.log(rejectResponse.body);
                chai_1.expect.fail();
            });
        });
    });
    it("performQuery COUNT", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "countSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["countSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_fullname"],
                "APPLY": [{ "countSeats": { "COUNT": "rooms_seats" } }]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query).then(function (response) {
                chai_1.expect(response.code).to.equal(200);
                console.log(response.body);
                chai_1.expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse) {
                console.log(rejectResponse.code);
                console.log(rejectResponse.body);
                chai_1.expect.fail("should pass");
            });
        });
    });
    it("performQuery on big query", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept", "courses_id", "courses_avg", "courses_instructor",
                    "courses_title", "minGrade"
                ],
                "ORDER": "courses_dept",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_id", "courses_avg", "courses_instructor", "courses_title"],
                "APPLY": [
                    {
                        "minGrade": {
                            "MIN": "courses_avg"
                        }
                    }
                ]
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query).then(function (response) {
                chai_1.expect(response.code).to.equal(200);
                console.log(response.body);
                chai_1.expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse) {
                console.log(rejectResponse.body);
                chai_1.expect.fail();
            });
        });
    });
    it("performQuery on simple COUNT", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept", "minGrade"
                ],
                "ORDER": "courses_dept",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_id", "courses_avg", "courses_instructor", "courses_title"],
                "APPLY": [
                    {
                        "minGrade": {
                            "MIN": "courses_avg"
                        }
                    }
                ]
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query).then(function (response) {
                chai_1.expect(response.code).to.equal(200);
                console.log(response.body);
                chai_1.expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse) {
                console.log(rejectResponse.body);
                chai_1.expect.fail();
            });
        });
    });
    it("performQuery on ORDER", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_fullname", "rooms_name", "rooms_address", "rooms_shortname",
                    "countSeats"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["countSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_fullname", "rooms_number", "rooms_name", "rooms_address"],
                "APPLY": [{ "countSeats": { "COUNT": "rooms_seats" } }]
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query).then(function (response) {
                chai_1.expect(response.code).to.equal(200);
                console.log(response.body);
                chai_1.expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse) {
                console.log(rejectResponse.body);
                chai_1.expect.fail();
            });
        });
    });
    it("query should fail ", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname", "rooms_seats",
                    "maxSeats", "countRooms"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["maxSeats", "countRooms"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } },
                    { "maxSeats": { "MAX": "rooms_seats" } },
                    { "sumSeats": { "SUM": "rooms_shortname" } },
                    { "countRooms": { "COUNT": "rooms_name" } },
                    { "avgSeats": { "AVG": "rooms_seats" } }]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response) {
            console.log(response.body);
            chai_1.expect.fail();
        }, function (rejectResponse) {
            console.log(rejectResponse.body);
            chai_1.expect(rejectResponse.code).to.equal(400);
        });
    });
    it("performQuery empty apply", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_dept": "cpsc"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept", "courses_uuid"
                ],
                "ORDER": { "dir": "DOWN",
                    "keys": ["courses_uuid"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_uuid"],
                "APPLY": []
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            chai_1.expect.fail();
        });
    });
    it("performQuery on department", function () {
        var query = {
            "WHERE": { "IS": {
                    "courses_dept": "cpsc"
                } },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept", "courses_avg", "courses_fail", "avgGrade", "countFail", "maxPass"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_avg", "courses_fail"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg", "courses_pass",
                    "courses_fail"],
                "APPLY": [{ "avgGrade": { "AVG": "courses_avg" } },
                    { "countFail": { "COUNT": "courses_fail" } },
                    { "maxPass": { "MAX": "courses_pass" } }]
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            chai_1.expect.fail();
        });
    });
    it("performQuery on COUNT #2", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "courses_dept": "eosc"
                        }
                    },
                    {
                        "GT": {
                            "courses_avg": 50
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_uuid"
                ],
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            chai_1.expect.fail();
        });
    });
    it("performQuery on random", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "courses_pass": 100
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_pass"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_pass"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_pass"],
                "APPLY": [
                    {
                        "maxSeats": {
                            "MAX": "courses_pass"
                        }
                    },
                    {
                        "AVGSEATS": {
                            "AVG": "courses_pass"
                        }
                    }
                ]
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            console.log(error);
            chai_1.expect.fail();
        });
    });
    it("performQuery on department avg", function () {
        var query = {
            "WHERE": { "IS": {
                    "courses_dept": "cpsc"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "deptAVG"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["deptAVG", "courses_dept"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_id"],
                "APPLY": [{
                        "deptAVG": {
                            "AVG": "courses_avg"
                        }
                    }]
            }
        };
        return insight.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            console.log(error);
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=getRoomsListTest.js.map
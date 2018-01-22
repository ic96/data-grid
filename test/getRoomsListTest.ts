/**
 * Created by ms076 on 2017-02-25.
 */
/**
 * Created by ms076 on 2017-01-21.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import {bodyParser} from "restify";

describe("getRoomsList", function () {
    var insight: InsightFacade = null;

    beforeEach(function () {
        insight = new InsightFacade;
    });

    afterEach(function () {
        insight = null;
    });

    it("test rooms.zip", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('rooms.zip');
        var response: InsightResponse = {code: 204, body: {}};

        return insight.addDataset('rooms', content).then(function (value) {
            console.log('sup: ' + JSON.stringify(value));
            //console.log("print addDataset fulfill value " + value);
            /*expect(value).to.not.equal('');
            expect(value).to.not.equal(' ');
            expect(value).to.not.be.an('undefined');*/
            expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        });

    });

    it("add first then remove gives 204", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('rooms.zip');
        var response: InsightResponse = {code: 204, body: {}};

        return insight.addDataset('rooms', content).then(function (value) {
            return insight.removeDataset('rooms');
        }).then(function (value) {
            expect(JSON.stringify(value)).to.equals(JSON.stringify(response));
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        });

    });

    it("invalid id return 400", function () {
        console.log('before calling insight.loadZipSync');
        var content = insight.loadZipSync('invalid.zip');
        var response: InsightResponse = {code: 400, body: {}};

        return insight.addDataset('champData', content).then(function (value) {
            console.log('sup: ' + JSON.stringify(value));
            //console.log("print addDataset fulfill value " + value);
            /*expect(value).to.not.equal('');
             expect(value).to.not.equal(' ');
             expect(value).to.not.be.an('undefined');*/
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equals(response.code);
            Log.test('Error: ' + err);

        });

    });

    it("performQuery on IS", function () {
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
        var content = insight.loadZipSync('rooms.zip');

        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response: InsightResponse) {

            console.log("response body: " + response.body);

            expect(response.code).to.equal(200);
            expect(response.body).to.deep.equal({
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
                }
            );
        }).catch(function (error) {
            Log.test('Error: ' + JSON.stringify(error));
            expect.fail();
        })
    });
/*
    it("should not be able to perform query when dataset is removed", function () {
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
        var content = insight.loadZipSync('rooms.zip');

        return insight.removeDataset('rooms').then(function (value) {
            return insight.performQuery(query);
        }).then(function (response: InsightResponse) {

            console.log("response body: " + response.body);
            expect.fail();

        }).catch(function (error) {
            Log.test('Error: ' + JSON.stringify(error));
            expect(error.code).to.equal(400);
        })
    });
*/
    it("remove then add then query should work", function () {
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
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.removeDataset('rooms');
        }).then(function (value) {
            return insight.addDataset('rooms', content);
        }).then(function (value) {
            return insight.performQuery(query);
        }).then(function (response: InsightResponse) {

            console.log("response body: " + response.body);
            expect(response.code).to.equal(200);
            expect(response.body).to.deep.equal({
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
                }
            );
        }).catch(function (error) {
            Log.test('Error: ' + JSON.stringify(error));
            expect.fail();

        })
    });

    it("query room type", function () {
        let query2 = {
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
        }).then(function (response: any) {

            console.log("response body rooms_type: " + JSON.stringify(response.body));

            expect(response.code).to.equal(200);
            expect(response.body).to.deep.equal(response.body);
        })
    });

    it("query specific room", function () {
        let query2 = {
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
        }).then(function (response: any) {

            console.log("response body: " + JSON.stringify(response.body));

            expect(response.code).to.equal(200);

        });
    });

    it("query order by url", function () {
        let query2 = {
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
        }).then(function (response: any) {

            console.log("response body: " + JSON.stringify(response.body));

            expect(response.code).to.equal(200);

        });
    });



    /*it.only("query bounding", function () {
        let query2 = {
            "WHERE": {

                "AND": [{
                    "GT": {
                        "rooms_lat": 49.2612
                    }
                },
                    {
                        "LT": {
                            "rooms_lat": 49.26129
                        }
                    },
                    {
                        "LT": {
                            "rooms_lon": -123.2480
                        }
                    },
                    {
                        "GT": {
                            "rooms_lon": -123.24809
                        }
                    }
                ]

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
        }).then(function (response: any) {

            console.log("response body: " + JSON.stringify(response.body));

            expect(response.code).to.equal(200);
            expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_name": "DMP_101"
                        },
                        {
                            "rooms_name": "DMP_110"
                        },
                        {
                            "rooms_name": "DMP_201"
                        },
                        {
                            "rooms_name": "DMP_301"
                        },
                        {
                            "rooms_name": "DMP_310"
                        }
                    ]
                }
            );

        });
    });*/

    it("query group simple query A", function () {
        let query = {
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
        }).then(function (response: any) {

            console.log(response.body);

            expect(response.body).to.deep.equal({
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

        }, function (rejectResponse: InsightResponse) {
            console.log(rejectResponse.body);
            expect(rejectResponse.code).to.equal(400);

        });
    });

    // performQuery runs on Query A for D3
    it("performQuery runs on Query A for D3", function () {
        let query = {
            "WHERE":{
                "AND":[
                    {
                        "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                    },
        {
            "GT":{
            "rooms_seats": 300
        }
        }
        ]
    },
        "OPTIONS":{
            "COLUMNS":[
                    "rooms_shortname",
                        "maxSeats"
        ],
            "ORDER": {
                "dir": "UP",
                    "keys": ["maxSeats"]
            },
            "FORM":"TABLE"
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            expect(response.body).to.deep.equal({"render":"TABLE","result":[{"rooms_shortname": "LSC","maxSeats": 350}, {"rooms_shortname": "HEBB","maxSeats": 375},{"rooms_shortname": "OSBO","maxSeats": 442}]});
        },function (rejectResponse: InsightResponse){
          console.log(rejectResponse.body);
          expect(rejectResponse.code).to.equal(400);
        })
    });

    // performQuery runs on SUM, MIN, COUNT, AVG
    it("performQuery runs on SUM, MIN, COUNT, AVG", function () {
        let query = {
            "WHERE":{},
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_shortname",
                        "minSeats",
                        "maxSeats",
                        "sumSeats",
                        "countRooms",
                        "avgSeats"

        ],
        "ORDER": {
            "dir": "DOWN",
                "keys": ["minSeats","sumSeats"]
        },
        "FORM":"TABLE"
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
           // console.log(response.body);
            expect(response.code).to.equal(200);
            console.log(response.body);
            expect(response.body).to.deep.equal(response.body)}, function(rejectResponse: InsightResponse){
           // console.log(rejectResponse.code);
            expect(rejectResponse.code).to.equal(400);
        })
    });

    // performQuery runs on Query B for D3
    it("performQuery runs on Query B for D3", function () {
        let query: any = {
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
          //  console.log(response.body);
            expect(response.body).to.deep.equal({"render":"TABLE",
                "result":[{"rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs" },
                    { "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs" },
                    { "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs" },
                    { "rooms_furniture": "Classroom-Fixed Tablets" },
                    { "rooms_furniture": "Classroom-Hybrid Furniture" },
                    { "rooms_furniture": "Classroom-Learn Lab" },
                    { "rooms_furniture": "Classroom-Movable Tables & Chairs" },
                    { "rooms_furniture": "Classroom-Movable Tablets" },
                    { "rooms_furniture": "Classroom-Moveable Tables & Chairs" },
                    { "rooms_furniture": "Classroom-Moveable Tablets"}]});
        }).catch(function (error) {
            Log.trace(JSON.stringify(error));
            expect.fail();
        })
    });

    // performQuery fails with empty GROUP
    it("performQuery fails with empty GROUP", function () {
        let query: any = {
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err.body['error']);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"Empty group"});
        })
    });

    it("performQuery should pass with empty APPLY", function () {
        let query: any = {
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });


    // performQuery fails with invalid ORDER direction
    it("performQuery fails with invalid ORDER direction", function () {
        let query: any = {
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err.body['error']);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"Invalid direction"});
        })
    });

    // performQuery fails with invalid ORDER key
    it("performQuery order in neither group nor apply", function () {
        let query: any = {
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        },function(rejectResponse: InsightResponse) {
            console.log(rejectResponse.body);
            expect(rejectResponse.code).to.equal(400);
        })
    });

    // performQuery fails with invalid APPLY key
    it("performQuery fails with invalid APPLY key", function () {
        let query = {
            "WHERE":{
                "AND":[
                    {
                        "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                    },
        {
            "GT":{
            "rooms_seats": 300
        }
        }
        ]
    },
        "OPTIONS":{
            "COLUMNS":[
                    "rooms_shortname",
                        "max_Seats"
        ],
            "ORDER": {
                "dir": "UP",
                    "keys": ["max_Seats"]
            },
            "FORM":"TABLE"
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
        },function(rejectResponse: InsightResponse){
            console.log(rejectResponse.code);
            expect(rejectResponse.code).to.equal(400);
        })
    });

    // performQuery fails with invalid APPLYTOKEN
    it("performQuery fails with invalid APPLYTOKEN", function () {
        let query = {
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
                console.log(response.body);
                console.log(response.code);
            }, function (rejectResponse: InsightResponse) {
                expect(rejectResponse.code).to.equal(400);
                console.log(rejectResponse.body);
            }
        );
    });

    it("performQuery MIN test invalid", function () {
        let query: any = {
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
                "APPLY": [{"minSeats": {"MIN": "rooms_seats"}}]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse: InsightResponse) {
                console.log(rejectResponse.code);
                console.log(rejectResponse.body);
                expect(rejectResponse.code).to.equal(400);
            })
        });
    });
    it("performQuery MIN test valid", function () {
        let query: any = {
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
                "APPLY": [{"minSeats": {"MIN": "rooms_seats"}}]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse: InsightResponse) {
                console.log(rejectResponse.code);
                console.log(rejectResponse.body);
                expect.fail("should not go here");
            })
        });
    });

    it("performQuery COUNT", function () {
        let query: any = {
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
                "APPLY": [{"countSeats": {"COUNT": "rooms_seats"}}]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse: InsightResponse) {
                console.log(rejectResponse.body);
                expect.fail();
            })
        });
    });
    it("performQuery COUNT", function () {
        let query: any = {
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
                "APPLY": [{"countSeats": {"COUNT": "rooms_seats"}}]
            }
        };
        var content = insight.loadZipSync('rooms.zip');
        return insight.addDataset('rooms', content).then(function (value) {
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal(response.body);
            }, function (rejectResponse: InsightResponse) {
                console.log(rejectResponse.code);
                console.log(rejectResponse.body);
                expect.fail("should pass");
            })
        });
    });

    it("performQuery on big query", function () {
        let query = {
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
                "GROUP": ["courses_dept","courses_id", "courses_avg", "courses_instructor", "courses_title"],
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
            return insight.performQuery(query).then(function (response: InsightResponse) {
                // console.log(response.body);
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal(response.body)
            }, function (rejectResponse: InsightResponse) {
                console.log(rejectResponse.body);
                expect.fail();
            })
        })
    });


    it("performQuery on simple COUNT", function () {
        let query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept", "minGrade"


                ],
                "ORDER": "courses_dept",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","courses_id", "courses_avg", "courses_instructor", "courses_title"],
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
            return insight.performQuery(query).then(function (response: InsightResponse) {
                // console.log(response.body);
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal(response.body)
            }, function (rejectResponse: InsightResponse) {
                console.log(rejectResponse.body);
                expect.fail();
            })
        })
    });



    it("performQuery on ORDER", function () {
        let query = {
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

                "APPLY": [{"countSeats": {"COUNT": "rooms_seats"}}]
            }
        };
        var content = insight.loadZipSync('champData.zip');
        return insight.addDataset('champData', content).then(function (value) {
            return insight.performQuery(query).then(function (response: InsightResponse) {
                // console.log(response.body);
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal(response.body)
            }, function (rejectResponse: InsightResponse) {
                console.log(rejectResponse.body);
                expect.fail();
            })
        })
    });


    it("query should fail ", function () {
        let query = {
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
        }).then(function (response: any) {

            console.log(response.body);

            expect.fail();

        }, function (rejectResponse: InsightResponse) {
            console.log(rejectResponse.body);
            expect(rejectResponse.code).to.equal(400);

        });
    });

    it("performQuery empty apply", function () {
        let query:QueryRequest = {
            "WHERE": {
                "IS":{
                    "courses_dept" : "cpsc"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept", "courses_uuid"

                ],
                "ORDER":{"dir": "DOWN",
                    "keys": ["courses_uuid"]
                },

                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_uuid"],
                "APPLY": []
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            expect.fail();
        })
    });

    it("performQuery on department", function () {
        let query: any = {
            "WHERE": {"IS": {
                "courses_dept": "cpsc"
            }},
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
                "GROUP": ["courses_dept",  "courses_avg", "courses_pass",
                    "courses_fail"],
                "APPLY": [{"avgGrade": {"AVG": "courses_avg"}},
                    { "countFail": { "COUNT": "courses_fail" }},
                    {"maxPass" : {"MAX": "courses_pass"}}]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            expect.fail();
        })
    });
    it("performQuery on COUNT #2", function () {
        let query: any = {
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            expect.fail();
        })
    });

    it("performQuery on random", function () {
        let query: any = {
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            console.log(error);
            expect.fail();
        })
    });



    it("performQuery on department avg", function () {

        let query: any =  {
            "WHERE": {"IS": {
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
                    "keys": ["deptAVG","courses_dept"]
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
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
        }).catch(function (error) {
            console.log(error);
            expect.fail();
        });




    });

});

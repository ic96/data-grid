"use strict";
var Util_1 = require("../Util");
var dist_1 = require("ts-node/dist");
var LeagueQueryController_1 = require("./LeagueQueryController");
var fs = require('fs');
var parse5 = require('parse5');
var path = require('path');
var chai = require('chai');
var InsightFacade = (function () {
    function InsightFacade() {
        this.datasets = {};
        this.response = { code: 0, body: {} };
        this.roomsList = [];
        Util_1.default.trace('InsightFacadeImpl::init()');
    }
    InsightFacade.prototype.loadZipSync = function (zipName) {
        try {
            var file = fs.readFileSync(zipName, { encoding: 'base64' });
            console.log("in loadzipync, after reading");
            return file;
        }
        catch (e) {
            console.log('Error:', e);
        }
    };
    InsightFacade.prototype.addDataset = function (id, content) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            try {
                var JSZip = require("jszip");
                var zip = new JSZip();
                var isHTML = false;
                var response = { code: 0, body: {} };
                zip.loadAsync(content, { base64: true }).then(function (zip) {
                    var zipPromises = [];
                    var index;
                    zip.forEach(function (path, entry) {
                        zipPromises.push(entry.async("string"));
                        if (path === 'index.htm') {
                            isHTML = true;
                            index = entry;
                        }
                    });
                    console.log(isHTML);
                    if (isHTML && index) {
                        index.async("string").then(function (indexHtml) {
                            var bodyHTML = that.getBetweenTags(indexHtml, "\<tbody\>", "\<\/tbody\>");
                            var parsedBodyString = parse5.parse(bodyHTML);
                            var validRooms = that.getValidRoomsList(parsedBodyString);
                            that.processHTMLZip(id, fulfill, reject, zipPromises, validRooms);
                        });
                    }
                    else {
                        that.processJSONZip(id, fulfill, reject, zipPromises);
                    }
                }).catch(function (err) {
                    that.response.code = 400;
                    that.response.body = { "error": err };
                    console.log('response body: ' + "The zip id does not exist");
                    reject(that.response);
                });
            }
            catch (err) {
                that.response.code = 400;
                that.response.body = { "error": err.message };
                reject(that.response);
            }
        });
    };
    InsightFacade.prototype.processJSONZip = function (id, fulfill, reject, promises) {
        var that = this;
        var processedData = [];
        Promise.all(promises).then(function (values) {
            var hasInvalid = values.some(function (content) {
                try {
                    var contentObj = JSON.parse(content);
                    if (contentObj) {
                        processedData.push(JSON.parse(content));
                    }
                }
                catch (e) {
                    that.response.code = 400;
                    that.response.body = { "error": e.message };
                    return;
                }
            });
            console.log('hasInvalid: ' + hasInvalid);
            if (processedData.length === 0) {
                console.log('sample.length == 0');
                that.response.code = 400;
                that.response.body = { "error": "File content could not be parsed" };
                reject(that.response);
                return;
            }
            if (that.datasets[id]) {
                console.log("this id has been cached already");
                that.response.code = 201;
                that.response.body = {};
            }
            else {
                console.log("this id has never been cached before");
                that.response.code = 204;
                that.response.body = {};
            }
            console.log("saving");
            that.save(id, processedData);
            fulfill(that.response);
        });
    };
    InsightFacade.prototype.processHTMLZip = function (id, fulfill, reject, promises, validRooms) {
        var that = this;
        var processedData;
        var filteredRooms;
        Promise.all(promises).then(function (values) {
            filteredRooms = that.getRoomsFromValidBuildings(values, validRooms);
            that.createHTMLDataset(filteredRooms).then(function (value) {
                processedData = value;
                if (processedData.length === 0) {
                    console.log('sample.length == 0');
                    that.response.code = 400;
                    that.response.body = { "error": "File content could not be parsed" };
                    reject(that.response);
                }
                if (that.datasets[id]) {
                    console.log("this id has been cached already");
                    that.response.code = 201;
                    that.response.body = {};
                }
                else {
                    console.log("this id has never been cached before");
                    that.response.code = 204;
                    that.response.body = {};
                }
                console.log("saving");
                that.save(id, processedData);
                fulfill(that.response);
            });
        });
    };
    InsightFacade.prototype.createHTMLDataset = function (rooms) {
        var that = this;
        var dataSet = [];
        var promises = [];
        rooms.forEach(function (room) {
            var roomObj = {
                result: []
            };
            var fullName = that.getFromHTMLWithTags("<div id=\"building-info\">", "<span", "</span", room);
            var shortName = that.getFromHTMLWithTags("<link rel=\"shortlink\"", "<link rel=\"shortlink\"", "/>", room);
            var address = that.getFromHTMLWithTags("<div id=\"building-info\">", "<div class=\"building-field\">", "</div></div>", room);
            fullName = parse5.parse(fullName).childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;
            address = parse5.parse(address).childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].value;
            shortName = parse5.parse(shortName).childNodes[0].childNodes[0].childNodes[0].attrs[1].value;
            var tbody = that.getFromHTMLWithTags(null, "<tbody>", "</tbody>", room);
            if (tbody) {
                var start;
                var startTagIndex = tbody.indexOf("<tr");
                var endTagIndex = tbody.indexOf("</tr>");
                while (startTagIndex >= 0 && endTagIndex >= 0) {
                    var current = tbody.substring(startTagIndex, endTagIndex + 5);
                    var roomNumber = that.getFromHTMLWithTags("<td class=\"views-field views-field-field-room-number\" >", "<a", "</a>", current);
                    var roomSeats = that.getFromHTMLWithTags("<td class=\"views-field views-field-field-room-capacity\" >", "<td", "</td>", current);
                    var roomType = that.getFromHTMLWithTags("<td class=\"views-field views-field-field-room-type\" >", "<td", "</td>", current);
                    var roomFurniture = that.getFromHTMLWithTags("<td class=\"views-field views-field-field-room-furniture\" >", "<td", "</td>", current);
                    roomNumber = parse5.parse(roomNumber);
                    var roomHref = roomNumber.childNodes[0].childNodes[1].childNodes[0].attrs[0].value;
                    roomNumber = roomNumber.childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;
                    roomSeats = Number.parseInt(parse5.parse(roomSeats).childNodes[0].childNodes[1].childNodes[0].value);
                    roomType = parse5.parse(roomType).childNodes[0].childNodes[1].childNodes[0].value.trim();
                    roomFurniture = parse5.parse(roomFurniture).childNodes[0].childNodes[1].childNodes[0].value.trim();
                    var roomName = shortName + "_" + roomNumber;
                    var roomInfo = {};
                    roomInfo["rooms_fullname"] = fullName;
                    roomInfo["rooms_shortname"] = shortName;
                    roomInfo["rooms_number"] = roomNumber;
                    roomInfo["rooms_name"] = roomName;
                    roomInfo["rooms_address"] = address;
                    roomInfo["rooms_seats"] = roomSeats;
                    roomInfo["rooms_type"] = roomType;
                    roomInfo["rooms_furniture"] = roomFurniture;
                    roomInfo["rooms_href"] = roomHref;
                    roomObj.result.push(roomInfo);
                    start = endTagIndex + 5;
                    startTagIndex = tbody.indexOf("<tr", start);
                    endTagIndex = tbody.indexOf("</tr>", start);
                }
            }
            var latLongPromise = that.getLatLong(address).then(function (data) {
                var geo = JSON.parse(data);
                roomObj.result.forEach(function (e) {
                    e["rooms_lat"] = geo.lat;
                    e["rooms_lon"] = geo.lon;
                });
            }).catch(function (e) {
                console.log(e);
            });
            promises.push(latLongPromise);
            if (roomObj.result.length > 0) {
                dataSet.push(roomObj);
            }
        });
        return Promise.all(promises).then(function (latlongs) {
            return dataSet;
        }).catch(function (e) {
            console.log(e);
        });
    };
    InsightFacade.prototype.getLatLong = function (address) {
        var that = this;
        var http = require("http");
        var geoCoord = "";
        return new Promise(function (fulfill, reject) {
            var host = "skaha.cs.ubc.ca";
            var urlAddress = encodeURIComponent(address);
            var path = "/api/v1/team24/" + urlAddress;
            var options = {
                host: host,
                port: 11316,
                path: path,
                headers: { Accept: 'application/json' }
            };
            http.get(options, function (result) {
                result.on("data", function (value) {
                    geoCoord = value.toString();
                    fulfill(geoCoord);
                });
            }).on("error", function (error) {
                console.log('error: ' + error.message);
                reject(error);
            });
        });
    };
    InsightFacade.prototype.getRoomsFromValidBuildings = function (values, validRooms) {
        var that = this;
        var filteredRooms = [];
        values.forEach(function (room) {
            var roomNameHTML = that.getFromHTMLWithTags("<div id=\"building-info\">", "<span", "</span>", room);
            var parsedRoomNameHTML;
            if (roomNameHTML) {
                parsedRoomNameHTML = parse5.parse(roomNameHTML);
                var name = parsedRoomNameHTML.childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;
                if (validRooms[name]) {
                    filteredRooms.push(room);
                }
            }
        });
        return filteredRooms;
    };
    InsightFacade.prototype.getFromHTMLWithTags = function (start, startTag, endTag, html) {
        var startAtIndex;
        var startTagIndex;
        var endTagIndex;
        if (start) {
            startAtIndex = html.indexOf(start);
        }
        else {
            startAtIndex = undefined;
        }
        if (startAtIndex > 0) {
            startTagIndex = html.indexOf(startTag, startAtIndex);
        }
        else {
            startTagIndex = html.indexOf(startTag);
        }
        if (startAtIndex > 0) {
            endTagIndex = html.indexOf(endTag, startAtIndex);
        }
        else {
            endTagIndex = html.indexOf(endTag);
        }
        var filteredResult;
        if (startTagIndex >= 0 && endTagIndex >= 0) {
            filteredResult = html.substring(startTagIndex, endTagIndex + endTag.length);
        }
        return filteredResult;
    };
    ;
    InsightFacade.prototype.getBetweenTags = function (indexHtml, start, end) {
        var bodyStart = indexHtml.search(start);
        var bodyEnd = indexHtml.search(end);
        var result = indexHtml.substring(bodyStart, bodyEnd + end.length);
        return result;
    };
    InsightFacade.prototype.getValidRoomsList = function (parsedHTML) {
        var listOfBuildings = {};
        var buildingNodeList = parsedHTML.childNodes[0].childNodes[1].childNodes;
        buildingNodeList.forEach(function (node) {
            if (node.attrs) {
                if (node.attrs.some(function (attribute) {
                    return (attribute.name === "title" && attribute.value === "Building Details and Map");
                })) {
                    node.childNodes.forEach(function (element) {
                        if (element.nodeName === "#text") {
                            listOfBuildings[element.value] = true;
                        }
                    });
                }
            }
        });
        return listOfBuildings;
    };
    InsightFacade.prototype.save = function (id, processedDataset) {
        var that = this;
        that.datasets[id] = processedDataset;
        console.log('writing to memory');
        try {
            fs.writeFileSync('./data/' + id + '.json', JSON.stringify(processedDataset, null, '\t'));
            console.log("cached mem: " + that.datasets[id]);
        }
        catch (e) {
            console.log('writefilesync error: ' + e);
        }
    };
    InsightFacade.prototype.getDataset = function (id) {
        if (this.datasets && this.datasets[id]) {
            return this.datasets[id];
        }
        else {
            try {
                var obj = fs.readFileSync('./data/' + id + '.json', 'utf8');
                return JSON.parse(obj);
            }
            catch (e) {
                return { missing: id + " is invalid key" };
            }
        }
    };
    InsightFacade.prototype.setDataset = function (id) {
        this.datasets[id] = { "courses": "bye" };
    };
    InsightFacade.prototype.clearCache = function (id) {
        delete this.datasets[id];
    };
    InsightFacade.prototype.clearDisk = function (id) {
        var pathToData = path.resolve('./data/' + id + '.json');
        fs.unlinkSync(pathToData);
    };
    InsightFacade.prototype.fileExists = function (path) {
        return fs.accessAsync(path, fs.constants.F_OK);
    };
    InsightFacade.prototype.removeDataset = function (id) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            var pathToData = path.resolve('./data/' + id + '.json');
            if (that.datasets[id] || dist_1.fileExists(pathToData)) {
                console.log("one is true");
                console.log('inside remove promise');
                delete that.datasets[id];
                var pathToData = path.resolve('./data/' + id + '.json');
                if (dist_1.fileExists(pathToData)) {
                    console.log("file exists in disk");
                    fs.unlinkSync(pathToData);
                }
                fulfill({ code: 204, body: {} });
            }
            else {
                reject({ code: 404, body: { "error": "The dataset you are trying to delete was not previously added" } });
            }
        });
    };
    InsightFacade.prototype.performQuery = function (query) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            try {
                var queryController = new LeagueQueryController_1.default(that);
                if (query !== null && Object.keys(query).length > 0 && typeof query !== 'undefined') {
                    var result = queryController.query(query);
                    if (result.body) {
                        var response = { code: 200, body: result.body };
                        return fulfill(response);
                    }
                    else if (result.missing) {
                        return reject({
                            code: 424,
                            body: {
                                missing: result.missing
                            }
                        });
                    }
                    else {
                        return reject({
                            code: 400,
                            body: { error: "Query failed" }
                        });
                    }
                }
                else {
                    return reject({
                        code: 400,
                        body: { error: "Invalid query format" }
                    });
                }
            }
            catch (error) {
                if (error.message == "Multiple datasets not allowed" || error.message == "invalid id") {
                    return reject({
                        code: 424,
                        message: error.message
                    });
                }
                else
                    return reject({
                        code: 400,
                        body: { error: error.message }
                    });
            }
        });
    };
    return InsightFacade;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightFacade;
;
//# sourceMappingURL=InsightFacade.js.map
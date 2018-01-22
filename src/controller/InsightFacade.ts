//commenting for initial commit
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";
import {queryParser} from "restify";
import {stringify} from "querystring";
import {error} from "util";
import {fileExists} from "ts-node/dist";
import QueryController from "./QueryController";
import LeagueQueryController from "./LeagueQueryController";



//var disk = require('./data/data.json');

var fs = require('fs');
var parse5 = require('parse5');
var path = require('path');
var chai = require('chai');


export interface Datasets {
    [id: string]: any;
}

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    private datasets: Datasets = {};
    private response: InsightResponse = {code: 0, body: {}};
    private roomsList: String[] = [];


    loadZipSync(zipName: string): string {
        //var fs = require('fs');

        try {
            var file = fs.readFileSync(zipName, {encoding: 'base64'});
            console.log("in loadzipync, after reading");
            return file;
        } catch (e) {
            console.log('Error:', e);
        }
    }


    addDataset(id: string, content: string): Promise<InsightResponse> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                var JSZip = require("jszip");
                var zip = new JSZip();
                var isHTML = false;
                var response: InsightResponse = {code: 0, body: {}};

                zip.loadAsync(content, {base64: true}).then(function (zip: JSZip) {
                    var zipPromises: any[] = [];
                    //var sample: any[] = [];
                    var index: any;

                    zip.forEach(function (path: any, entry: any) {
                        zipPromises.push(entry.async("string"));
                        //console.log(path);
                        if (path === 'index.htm') {
                            isHTML = true;
                            index = entry;
                        }
                    });
                    console.log(isHTML);

                    if (isHTML && index) {
                        //do html stuff
                        index.async("string").then(function(indexHtml:string) {
                         var bodyHTML = that.getBetweenTags(indexHtml, "\<tbody\>", "\<\/tbody\>");
                         var parsedBodyString = parse5.parse(bodyHTML);
                         var validRooms = that.getValidRoomsList(parsedBodyString);
                         that.processHTMLZip(id, fulfill, reject, zipPromises, validRooms);
                         });
                    } else {
                        //do JSON stuff
                        that.processJSONZip(id, fulfill, reject, zipPromises);
                    }

                    //console.log(zipPromises);


                }).catch(function (err: any) {
                    that.response.code = 400;
                    that.response.body = {"error": err};
                    console.log('response body: ' + "The zip id does not exist");
                    reject(that.response);
                });
            } catch (err) {
                that.response.code = 400;
                that.response.body = {"error": err.message};
                reject(that.response);
            }

        });
    }

    private processJSONZip(id: any, fulfill: any, reject: any, promises: any) {
        let that = this;
        var processedData: any = [];

        Promise.all(promises).then(function (values: any) {
            //console.log(values);
            var hasInvalid = values.some(function (content: any) {
                //console.log('after promise.all');
                try {
                    var contentObj = JSON.parse(content);
                    //console.log('contentObj: ' + JSON.stringify(contentObj));
                    if(contentObj){
                        //if(contentObj.getElementsByTagName("data")){
                            processedData.push(JSON.parse(content));

                    }
                }catch (e){
                    that.response.code = 400;
                    that.response.body = {"error": e.message};
                    return;
                }
            });

            console.log('hasInvalid: '+hasInvalid);
            //console.log(processedData);

            if (processedData.length === 0) {
                console.log('sample.length == 0');
                that.response.code = 400;
                that.response.body = {"error": "File content could not be parsed"};

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
            //console.log(that.datasets['champData'][9]);
            fulfill(that.response);
        });
    }

    private processHTMLZip(id: any, fulfill: any, reject: any, promises: any[], validRooms: any) {
        var that = this;
        var processedData: any;
        var filteredRooms: any;

        Promise.all(promises).then(function (values: any[]) {
            //console.log('html values: ' + values);

            //console.log('hasInvalid: '+hasInvalid);
            filteredRooms = that.getRoomsFromValidBuildings(values, validRooms);
            that.createHTMLDataset(filteredRooms).then(function (value :any) {
                //console.log(value);
                //console.log("value" + JSON.stringify(value));
                processedData = value;
                //console.log(processedData);
                if (processedData.length === 0) {
                    console.log('sample.length == 0');
                    that.response.code = 400;
                    that.response.body = {"error": "File content could not be parsed"};

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
                //console.log(that.datasets['champData'][9]);
                fulfill(that.response);
            });

        });


    }

    private createHTMLDataset(rooms: any): Promise<Object>{
        //for each room, we can use getFromHTMLWithTags to get us the fullName, address, shortName
        let that = this;
        var dataSet: any = [];
        var promises :any = [];

        rooms.forEach(function (room: any) {
            var roomObj: any = {
                result:[]
            };

            var fullName = that.getFromHTMLWithTags("<div id=\"building-info\">", "<span", "</span", room);
            var shortName = that.getFromHTMLWithTags("<link rel=\"shortlink\"", "<link rel=\"shortlink\"", "/>", room);
            var address = that.getFromHTMLWithTags("<div id=\"building-info\">", "<div class=\"building-field\">", "</div></div>", room);

            //parse the html and get the childnode value
            fullName = parse5.parse(fullName).childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;
            address = parse5.parse(address).childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].value;
            shortName = parse5.parse(shortName).childNodes[0].childNodes[0].childNodes[0].attrs[1].value;

            //get roomNumber, roomName, roomSeats, roomType, roomFurniture, roomHref

            //all the information is in tbody so get tbody
            var tbody = that.getFromHTMLWithTags(null, "<tbody>", "</tbody>", room);

            if(tbody){
                var start;
                var startTagIndex = tbody.indexOf("<tr");
                var endTagIndex = tbody.indexOf("</tr>");

                while(startTagIndex >= 0 && endTagIndex >= 0) {
                    var current = tbody.substring(startTagIndex, endTagIndex + 5);
                    var roomNumber:any = that.getFromHTMLWithTags("<td class=\"views-field views-field-field-room-number\" >", "<a", "</a>", current);

                    var roomSeats:any = that.getFromHTMLWithTags("<td class=\"views-field views-field-field-room-capacity\" >", "<td", "</td>", current);
                    var roomType:any = that.getFromHTMLWithTags("<td class=\"views-field views-field-field-room-type\" >", "<td", "</td>", current);
                    var roomFurniture:any = that.getFromHTMLWithTags("<td class=\"views-field views-field-field-room-furniture\" >", "<td", "</td>", current);

                    //get roomHref from roomNumber
                    roomNumber = parse5.parse(roomNumber);
                    var roomHref = roomNumber.childNodes[0].childNodes[1].childNodes[0].attrs[0].value;

                    roomNumber = roomNumber.childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;
                    roomSeats = Number.parseInt(parse5.parse(roomSeats).childNodes[0].childNodes[1].childNodes[0].value);
                    roomType = parse5.parse(roomType).childNodes[0].childNodes[1].childNodes[0].value.trim();
                    roomFurniture = parse5.parse(roomFurniture).childNodes[0].childNodes[1].childNodes[0].value.trim();

                    var roomName:any = shortName + "_" + roomNumber;

                    var roomInfo:any = {};
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

            var latLongPromise = that.getLatLong(address).then(function (data: any) {
               var geo = JSON.parse(data);
               //console.log(JSON.stringify(geo));
               roomObj.result.forEach(function (e: any) {
                   e["rooms_lat"] = geo.lat;
                   e["rooms_lon"] = geo.lon;
                   //console.log(e);
               });
            }).catch(function (e) {
                console.log(e);
            });
            promises.push(latLongPromise);
            if(roomObj.result.length > 0){
                dataSet.push(roomObj);
                //console.log(dataSet);
            }
        });
        return Promise.all(promises).then(function(latlongs) {
            return dataSet;
        }).catch(function(e) {
            console.log(e);
        });
    }


    private getLatLong(address: any): Promise<any>{
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
                headers: {Accept: 'application/json'}
            };

            http.get(options, function (result: any) {
                //console.log('http result: ' + result);

                result.on("data", function (value: any) {
                    //console.log('value: ' + value);
                    geoCoord = value.toString();
                    fulfill(geoCoord);
                });
            }).on("error", function (error: any) {
                console.log('error: ' + error.message);
                reject(error);
            });
        });
    }

    private getRoomsFromValidBuildings(values: any, validRooms: any): any{
        var that = this;
        var filteredRooms: any[] = [];

        values.forEach(function (room: any) {
            //console.log('room in listOfValidRooms: ' + room);
            var roomNameHTML = that.getFromHTMLWithTags("<div id=\"building-info\">", "<span", "</span>", room);

            //console.log(roomNameHTML);

            //if roomNameHTML exists, then go to its childNode and get its room name value
            var parsedRoomNameHTML:any;
            if (roomNameHTML) {
                parsedRoomNameHTML = parse5.parse(roomNameHTML);

                //console.log(parsedRoomNameHTML.childNodes[0]);

                var name = parsedRoomNameHTML.childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;

                //console.log(parsedRoomNameHTML.childNodes[0].childNodes[1].childNodes[0].childNodes[0].value);

                //if the room name value exists in validRooms then it is a valid room so we push it into our list of filtered rooms
                if (validRooms[name]) {
                    filteredRooms.push(room);
                    //console.log(filteredRooms);
                }
            }
        });
        return filteredRooms;
        //console.log(filteredRooms.length);
    }

    private getFromHTMLWithTags(start:string, startTag:string, endTag:string, html:string): string {

        //find the index of start, startTag, endTag and then use substring on html with those indices

        var startAtIndex;
        var startTagIndex;
        var endTagIndex;

        if(start){
            startAtIndex = html.indexOf(start);
        }else{
            startAtIndex = undefined;
        }

        if(startAtIndex > 0){
            startTagIndex = html.indexOf(startTag, startAtIndex);
        }else{
            startTagIndex = html.indexOf(startTag);
        }

        if(startAtIndex > 0){
            endTagIndex = html.indexOf(endTag, startAtIndex);
        }else{
            endTagIndex = html.indexOf(endTag);
        }

        var filteredResult:string;
        if (startTagIndex >= 0 && endTagIndex >= 0) {
            filteredResult = html.substring(startTagIndex, endTagIndex + endTag.length);
        }
        return filteredResult;
    };

    private getBetweenTags(indexHtml: string, start: string, end: string) {
        var bodyStart = indexHtml.search(start);
        var bodyEnd = indexHtml.search(end);
        var result = indexHtml.substring(bodyStart, bodyEnd + end.length);
        //console.log(result);
        return result;
    }

    private getValidRoomsList(parsedHTML: any): {} {
        var listOfBuildings: any = {};
        //console.log('parsedHTML.childNodes[0].childNodes[1].childNodes: ' + parsedHTML.childNodes[0].childNodes[1].childNodes);
        var buildingNodeList = parsedHTML.childNodes[0].childNodes[1].childNodes;
        //console.log('data array ' + dataArray);
        buildingNodeList.forEach(function (node: any) {
            //console.log(item);
            if (node.attrs) {
                // if the item has attribute name === "title" and attribute value === "Building Details and Map"
                if (node.attrs.some(function (attribute: any) {
                        return (attribute.name === "title" && attribute.value === "Building Details and Map");
                    })) {
                    //console.log(item.childNodes);
                    node.childNodes.forEach(function (element: any) {
                        if (element.nodeName === "#text") {
                            listOfBuildings[element.value] = true;
                        }
                    })
                }
            }
        });
        //console.log(listOfBuildings);
        //console.log(Object.keys(listOfRooms).length);
        return listOfBuildings;
    }

    private save(id: string, processedDataset: any) {
        let that = this;
        that.datasets[id] = processedDataset;
        //console.log(that.datasets[id]);
        console.log('writing to memory');
        try {fs.writeFileSync('./data/' + id + '.json', JSON.stringify(processedDataset, null, '\t'));
            console.log("cached mem: " + that.datasets[id]);
            }catch (e){
            console.log('writefilesync error: ' + e);
        }

    }

    public getDataset(id: string): any {
        if (this.datasets && this.datasets[id]) {
            return this.datasets[id];
        } else {

            try {
                var obj = fs.readFileSync('./data/' + id + '.json', 'utf8');
                return JSON.parse(obj);
            }catch (e){
                return {missing: id + " is invalid key"}

            }
        }
    }

    public setDataset(id: string): any {
        this.datasets[id] = {"courses": "bye"};
    }

    public clearCache(id: any): any {
        delete this.datasets[id];
    }

    public clearDisk(id: any): any{
        var pathToData = path.resolve('./data/' + id + '.json');
        fs.unlinkSync(pathToData);
    }

    public fileExists(path: any): any{
        return fs.accessAsync(path, fs.constants.F_OK); //F_OK checks if file is visible, is default does no need to be specified.
    }

    removeDataset(id: string): Promise<InsightResponse> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            // if cache exists then that means it has to also exist in disk so delete both
            var pathToData = path.resolve('./data/' + id + '.json');

            if (that.datasets[id] ||fileExists(pathToData)) {

                console.log("one is true");
                console.log('inside remove promise');
                delete that.datasets[id];

                //console.log('path.resolve: '+path.resolve('./data/' + id + '.json'));
                var pathToData = path.resolve('./data/' + id + '.json');

                if(fileExists(pathToData)){
                    console.log("file exists in disk");
                    fs.unlinkSync(pathToData);
                }
                fulfill({code: 204, body: {}});
            } else {
                //it is neither in cache nor disk
                reject({code: 404, body: {"error": "The dataset you are trying to delete was not previously added"}});
            }

        });
    }



    performQuery(query: QueryRequest): Promise <InsightResponse> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                let queryController = new LeagueQueryController(that);
                if (query !== null && Object.keys(query).length > 0 && typeof query !== 'undefined') {
                    let result = queryController.query(query);
                    if (result.body) {
                        let response = <InsightResponse>{code: 200, body: result.body};
                        return fulfill(response);
                    } else if (result.missing) {
                       return reject({
                            code: 424,
                            body: {
                                missing: result.missing
                            }
                        });

                    } else {
                        return reject({
                            code: 400,
                            body: {error: "Query failed"}
                        });
                    }
                }
                else {
                    return reject({
                        code: 400,
                        body: {error: "Invalid query format"}
                    });
                }
            } catch (error) {
                if (error.message == "Multiple datasets not allowed" || error.message == "invalid id") {
                    return reject({
                        code: 424,
                        message: error.message
                    });
                }else

                 return reject({
                    code: 400,
                    body: {error: error.message}
                });


            }
        })
    }
};




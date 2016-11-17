/*
 * SWAPI_nodeWrapper was written by Scott Mollon and released under an MIT license. It is a nodejs interface for SWAPI (Star Wars API).
 * 
 * @license
 * The MIT License (MIT)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var SW_API = function() {
    
    var request = require('request');
    var q = require('q');
    
    var BASEURL = 'http://swapi.co/api/';   //Base url for the API
    
    // A list of the API resources which is downloaded from the API itself.
    // This list includes what resources are supported and URI for each
    var allResourceList = null;
    
    /**
     * @method SW_API.send_request
     * @private
     * @description Handles sending the GET requests to the api
     * @param url - The url to which to send the request
     * @param data - The query parameters for the request
     * @param callback - The callback function for the request is resolved
     */
    var send_request = function(url, data, callback){
        
        data = data || {};

        var options = {
            url: url,
            method: 'GET',
            qs: data
        };
        
        request(options, callback);
    };
    
    /**
    * @method SW_API.getAllResources
    * @private
    * @description Gets the supported resources from the API
    */
    var getAllResources = function() {
        var deferred = q.defer();

        var callback = function(error, response, body){
            if (error){
                deferred.reject(error);
            }
            else if (response.statusCode === 200) {
                
                //save resource info privately
                allResourceList = JSON.parse(body);
                
                deferred.resolve(true);
            }
            else {
                deferred.reject(body.message);
            }
        };

        send_request(BASEURL, {}, callback);

        return deferred.promise;
    };
    
    /**
    * @method SW_API.checkAllResources
    * @private
    * @description Checks to see if the resource information has been downloaded from 
    * the API, and if not downloads it.
    */
    var checkAllResources = function() {
        var deferred = q.defer();

        if (allResourceList === null)
            getAllResources().then(function(){
                deferred.resolve(true);
            }, function(error){
                deferred.reject(error);
            });
        else
          deferred.resolve(true);

        return deferred.promise;
    };
    
    /**
     * SW_API
     * @class SW_API
     * @version 1.0.0
     * @description A javascript node js interface for the SWAPI (Star Wars API).
     */
    return {
        /**
         * @method SW_API.getResourceTypes
         * @description Returns a string array of the supported resources such as people, vehicles, planets, etc...
         * @returns {'string[]'} A promise which will resolve to a string array
         */
        getResourceTypes: function() {
            var deferred = q.defer();
            
            checkAllResources().then(function(){
                deferred.resolve(Object.keys(allResourceList));
            });
 
            return deferred.promise;
        },
        /**
         * @method SW_API.getAllResourcesByType
         * @description Returns a paged list of all items of a specific resource type. The resource type must be one
         * of the types the API supports. If no page is provided when called the first page of results is returned.
         * @param {string} resource - The type of resource for which to retrieve items such as people, planets, vehicles.
         * @param {int} page - The page of results to retrieve.
         * @returns {json} - A promise which will resolve a json response with a results list and information about number of and current page.
         * @example //Get first page of results
         * var SWAPI = require('SW_API');
         * SWAPI.getAllResourcesByType('people').then(function(pagedResult){
         *   //do something with pagedResults of people
         * });
         * @example //Request a page of results
         * var SWAPI = require('SW_API');
         * SWAPI.getAllResourcesByType('people', 2).then(function(pagedResult){
         *   //do something with pagedResults of people
         * });
         * @example //Response
         * {
         *  'totalPages': 3,
         *  'currentPage': 2,
         *  'count': 26,
         *  'next': 'http://...../?page=3',
         *  'previous': 'http://...../?page=1',
         *  'results': []
         * }
         */
        getAllResourcesByType: function(resource, page) {
            var deferred = q.defer();
            
            page = page || 1;
            
            var pagedCallback = function(error, response, body){
                if (error){
                    deferred.reject(error);
                }
                else if (response.statusCode === 200) {
                    responseBody = JSON.parse(body);
                    responseBody.totalPages = Math.ceil(responseBody.count / 10);
                    responseBody.currentPage = page;
                    deferred.resolve(responseBody);
                }
                else
                {
                    deferred.reject(JSON.parse(body));
                }
            };
            
            checkAllResources().then(function(){
                send_request(allResourceList[resource], {'page': page}, pagedCallback);
            });
 
            return deferred.promise;
        },
        /**
         * @method SW_API.getResourceById
         * @description Returns a single item of a given resource type found by it's id.
         *  @param {string} resource - The type of resource for which to retrieve the item such as people, planets, vehicles.
         *  @param {int} id - The id of the specific item
         *  @returns {json} - A promise which will resolve to the json object describing the item
         *  @example //Retrieve a vehicle by id of 10
         *  var SWAPI = require('SW_API');
         *  SWAPI.getResourceById('vehicle', 10).then(function(vehicle){
         *   //do something with vehicle
         * });
         */
        getResourceById: function(resource, id) {
            var deferred = q.defer();
            
            var callback = function(error, response, body){
                if (error){
                    deferred.reject(error);
                }
                else if (response.statusCode === 200) {
                    deferred.resolve(JSON.parse(body));
                }
                else {
                    deferred.reject(body.message);
                }
            };
            
            checkAllResources().then(function(){
                send_request(allResourceList[resource]+id, {}, callback);
            });
 
            return deferred.promise;
        },
        /**
         * @method SW_API.getResourcesBySearch
         * @description Returns a paged list of all items of a specific resource type matching a search string. The resource type must be one
         * of the types the API supports. If no page is provided when called the first page of results is returned.
         * @param {string} resource - the type of resource for which to retrieve items such as people, planets, vehicles.
         * @param {string} searchString - The value to use when searching items.
         * @param {int} page - The page of results to retrieve.
         * @returns {json} - A promise which will resolve a json response with a results list and information about number of and current page.
         * @example //Get first page of results
         * var SWAPI = require('SW_API');
         * SWAPI.getResourcesBySearch('people', 'Fett').then(function(pagedResult){
         *   //do something with pagedResults of people matchign Fett
         * });
         * @example //Request a page of results
         * var SWAPI = require('SW_API');
         * SWAPI.getAllResourcesByType('people', 'Fett', 2).then(function(pagedResult){
         *   //do something with pagedResults of people matchign Fett
         * });
         * @example //Response
         * {
         *  'totalPages': 3,
         *  'currentPage': 2,
         *  'count': 26,
         *  'next': 'http://...../?search=Fett&page=3',
         *  'previous': 'http://...../?search=Fett&page=1',
         *  'results': []
         * }
         */
        getResourcesBySearch: function(resource, searchString, page) {
            var deferred = q.defer();
            
            page = page || 1;
            
            var pagedCallback = function(error, response, body){
                if (error){
                    deferred.reject(error);
                }
                else if (response.statusCode === 200) {
                    responseBody = JSON.parse(body);
                    responseBody.totalPages = Math.ceil(responseBody.count / 10);
                    responseBody.currentPage = page;
                    deferred.resolve(responseBody);
                }
                else
                {
                    deferred.reject(JSON.parse(body));
                }
            };
            
            checkAllResources().then(function(){
                send_request(allResourceList[resource], {'search': searchString, 'page': page}, pagedCallback);
            });
 
            return deferred.promise;
        },
        /**
         * @method SW_API.getResourceByURL
         * @description Returns the raw SWAPI response. Use this when retrieving related resources from an item such as homeworld, or films.
         * This can be used to get a single resource, a list of items, or if given a query string a search or a page of items.
         * @param {string} url - the url of the resource to retrieve.
         * @returns {json} - A promise which will resolve the raw json response from the SWAPI.
         * @example //Get first page of results
         * var SWAPI = require('SW_API');
         * SWAPI.getResourcesByUrl('http://swapi.co/api/films/1/').then(function(film){
         *   //do something with film
         * });
         */
        getResourceByUrl: function(url) {
            var deferred = q.defer();
            
            var pagedCallback = function(error, response, body){
                if (error){
                    deferred.reject(error);
                }
                else if (response.statusCode === 200) {
                    responseBody = JSON.parse(body);
                    
                    if (responseBody.next || responseBody.previous)
                    {
                        responseBody.totalPages = Math.ceil(responseBody.count / 10);
                        
                        //get the current page number from either next or previous
                        var query;
                        if (responseBody.next)
                            query = responseBody.next.split('?')[1];
                        else
                            query = responseBody.previous.split('?')[1];
                        
                        var pageindex = query.indexOf('page');
                        var equalindex = query.indexOf('=', pageindex);
                        var ampindex = query.indexOf('&', equalindex);
                        
                        var page;
                        if (ampindex !== -1)
                            page = query.substring(equalindex+1, ampindex);
                        else
                            page = query.substring(equalindex+1);
                        
                        if (responseBody.next)
                            responseBody.page = parseInt(page)-1;
                        else
                            responseBody.page = parseInt(page)+1;
                    }
                    deferred.resolve(responseBody);
                }
                else
                {
                    deferred.reject(JSON.parse(body));
                }
            };
            
            checkAllResources().then(function(){
                send_request(url, {}, pagedCallback);
            });
 
            return deferred.promise;
        }
    };
};

module.exports = new SW_API();
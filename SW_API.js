/*
 * SWAPI_nodeWrapper was written by Scott Mollon and released under an MIT license.
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
    
    var BASEURL = 'http://swapi.co/api/';
    var allResourceList = null;
    
    var send_request = function(url, data, callback){
        
        data = data || {};

        var options = {
            url: url,
            method: 'GET',
            qs: data
        };
        
        request(options, callback);
    };
    
    var getAllResources = function() {
        var deferred = q.defer();

        var callback = function(error, response, body){
            if (error){
                deferred.reject(error);
            }
            else if (response.statusCode === 200) {
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
    
    return {
        getResourceTypes: function() {
            var deferred = q.defer();
            
            checkAllResources().then(function(){
                deferred.resolve(Object.keys(allResourceList));
            });
 
            return deferred.promise;
        },
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
        }
    };
};

module.exports = new SW_API();
var SWAPI = require('../SW_API');

describe("get all the resource names", function() {
    
   it("should get all base resource names", function(done) {
        SWAPI.getResourceTypes().then(function(response){
            expect(response).toContain('vehicles');
            expect(response).toContain('people');
            done();
        });
   });
});

describe("get a specific resource by id", function() {
    
    it("should get luke skywalker by id of 1", function(done) {
        SWAPI.getResourceById('people', '1').then(function(person) {
            expect(person.name).toEqual('Luke Skywalker');
            done(); 
        });
    });
    
    it("should get millenium falcon by id of 10", function(done) {
        SWAPI.getResourceById('starships', '10').then(function(starship) {
            expect(starship.name).toEqual('Millennium Falcon');
            done();
        });
    });
});

describe("get a specific resource by search", function() {
   
    it("should find Bobba Fett by search", function(done) {
       SWAPI.getResourcesBySearch('people', 'fett').then(function(response) {
          expect(response.results.length).toEqual(2);
          done();
       });
    });
    
    it("should find Twi'lek by search", function(done) {
        SWAPI.getResourcesBySearch('species', 'twi').then(function(response) {
          expect(response.results.length).toBe(1);
          done();
       });
    });
});

describe("get all resources of type", function() {
   
    it("should get page 1 of all planets", function(done) {
        SWAPI.getAllResourcesByType("planets").then(function(response) {
           expect(response.results.length).toBe(10);
           done();
        });
    });
    
    it("should get page 7 of all planets", function(done) {
        SWAPI.getAllResourcesByType("planets", 7).then(function(response) {
           expect(response.results.length).toBe(1);
           done();
        });
    });
    
    it("should fail to get page 10 of all planets", function(done) {
        SWAPI.getAllResourcesByType("planets", 10).then(function(response) {
           expect(response.results.length).toBe(0);
           done();
        }, function(response) {
            expect(response.detail).toEqual("Not found");
            done();
        });
    });
});

describe("get a resource by url", function() {
    
    it("should get Millennium Falcom by URL", function(done) {
        var url = 'http://swapi.co/api/starships/10';
        SWAPI.getResourceByUrl(url).then(function(starship) {
            expect(starship.name).toEqual('Millennium Falcon');
            done();
        });
    });
    
    it("should get all vehicles by URL and find first page", function(done) {
        var url = 'http://swapi.co/api/vehicles';
        SWAPI.getResourceByUrl(url).then(function(results) {
            expect(results.page).toEqual(1);
            done();
        });
    });
    
    it("should get all vehicles by URL and find fourth page", function(done) {
        var url = 'http://swapi.co/api/vehicles/?page=4';
        SWAPI.getResourceByUrl(url).then(function(results) {
            expect(results.page).toEqual(4);
            done();
        });
    });
    
    it("should search vehicles by URL for s", function(done) {
        var url = 'http://swapi.co/api/vehicles/?search=s';
        SWAPI.getResourceByUrl(url).then(function(results) {
            expect(results.page).toEqual(1);
            done();
        });
    });
    
    it("should search vehicles by URL for s and fourth page", function(done) {
        var url = 'http://swapi.co/api/vehicles/?search=s&page=4';
        SWAPI.getResourceByUrl(url).then(function(results) {
            expect(results.page).toEqual(4);
            done();
        });
    });
});


# SWAPI_nodeWrapper

A javascript wrapper for the [Star Wars API](http://swapi.co/). There are a lot of other javascript wrappers out there, none of them doing 
things quite the way I wanted to.

## Methods

* getResourceNames - Gets the list of valid resource names (people, planets, species, etc.) from the SWAPI along with their URIs.
* getResourceById - Gets a single resource of a given type by ID. Ex. gets a specific person by ID.
* getAllResourcesByType - Gets a paged list of all resources of a given type. Ex. All planets.
* getResourcesBySearch - Gets a paged list of all resources of a given type that match a search string.
* getResourceByUrl - Gets a single or paged resource from an entire SWAPI URL.

## Installation

SWAPI_nodeWrapper is not yet available on npm, so you'll need to build it (or use the min file in the dist folder) manually.

## Build

1. Clone the repo locally
2. run
``` npm install ```
3. run
``` grunt build ```

## Run Unit Tests

1. run 
``` grunt test ```

## Usage

Get starship by its id
```javascript
var SWAPI = require('SW_API');
SWAPI.getResourceById('starships', '10').then(function(starship) {
            console.log(starship.name); //Millennium Falcon
        });
```

Search for Fett in people
```javascript
var SWAPI = require('SW_API');
SWAPI.getResourcesBySearch('people', 'fett').then(function(response) {
          console.log(response); // [{'name': 'Bobba Fett'}, {'name': 'Jango Fett'}]
       });
```

## A Work In Progress

Would like to check the resource names sent to the get methods and reject if they are not one of the valid resource names.
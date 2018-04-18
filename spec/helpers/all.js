beforeEach(function () {
    this.api = require('../../index.js');
    this.assetsPath = 'https://assets-alesanchezr.c9users.io';
    this.apiPath = 'https://assets-alesanchezr.c9users.io';
    this.api.setOptions({ assetsPath: this.assetsPath, apiPath: this.apiPath });
    
    fakeFetch = function(data){
        return Promise.resolve({
            status: 200, 
            json: () => data
        });
    };

    this.fakeAssetsRequest = function(method, url){
        return [
            this.assetsPath+url,
            { method, headers: { 'Content-Type': 'application/json' } }
        ];
    }

    this.fakeAPIRequest = function(method, url){
        return [
            this.apiPath+url,
            { method, headers: { 'Content-Type': 'application/json' } }
        ];
    }
    
    spyOn(this.api, 'fetch').and.returnValue(fakeFetch({object: 'asd'}));
});
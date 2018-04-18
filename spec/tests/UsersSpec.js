describe("Users", function() {
    
    it("should call the proper url", function() {
        
        this.api.users().all().then((data) => {
          console.log('asd');
        });
        expect(this.api.fetch).toHaveBeenCalledWith(...this.fakeAPIRequest('get', '/user/'));
    });

});

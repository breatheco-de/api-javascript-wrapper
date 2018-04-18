describe("Users", function() {
    
    it("should call the proper url", function() {
        this.api.users().all();
        expect(this.api.fetch).toHaveBeenCalledWith(...this.fakeAPIRequest('get', '/user/'));
    });

});

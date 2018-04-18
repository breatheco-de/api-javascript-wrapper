describe("Syllabus", function() {
    
    it("should throw error with wrong params", function() {
        expect(() => {
          this.api.syllabus().get()
        }).toThrow(new Error("Missing slug"));
    });
    
    it("should call the proper url", function() {
        this.api.syllabus().get('full-stack');
        expect(this.api.fetch).toHaveBeenCalledWith(...this.fakeAssetsRequest('get', '/syllabus/full-stack'));
    });

});

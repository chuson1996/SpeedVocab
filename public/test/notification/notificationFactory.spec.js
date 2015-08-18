describe('notificationFactory', function () {
    var notificationFactory;
    var originalTimeout;
    beforeEach(module('notification'));
    beforeEach(inject(function (_notificationFactory_) {
        notificationFactory = _notificationFactory_;
    }));
    describe('1 + 3', function () {
        it('should be equal to 4', function () {
            expect(1+3).toEqual(4);
        })
    })

})
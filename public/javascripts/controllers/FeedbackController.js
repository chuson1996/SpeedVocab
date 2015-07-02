var FeedbackController = (function () {
    function FeedbackController($http, helper) {
        this.$http = $http;
        this.helper = helper;
        this.$inject = ['$http', 'helper'];
        this.fbList = [];
        this.getFeedbacks();
    }
    FeedbackController.prototype.getFeedbacks = function () {
        var _this = this;
        this.$http.get('/speedvocab/api/getfeedbacks').then(function (res) {
            //console.log(res);
            _this.fbList = _this.helper.orderByDate(_.map(res.data, function (o) {
                return {
                    avatar: o.avatar,
                    content: o.content,
                    createdAt: o.createdAt
                };
            }));
        });
    };
    FeedbackController.prototype.submitFeedback = function (content) {
        this.fbList.push({
            avatar: this.avatar,
            content: this.content,
            createdAt: new Date()
        });
        this.fbList = this.helper.orderByDate(this.fbList);
        this.content = null;
        this.$http.post('/speedvocab/post/addfeedback', {
            content: content
        }).then(function (res) {
            console.log(res);
        }).catch(console.error);
    };
    return FeedbackController;
})();
angular.module('controllers').controller('FeedbackCtrl', FeedbackController);
//# sourceMappingURL=FeedbackController.js.map
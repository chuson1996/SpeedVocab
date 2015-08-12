(function () {
    angular.module('notification')
        .controller('NotificationController', NotificationController)

        /* With a GET request, it will retrieve unread notification
         *  With a PUT request, it will mark all unread notification as read */


    function NotificationController(notificationFactory){
        var vm = this;

        notificationFactory.getUnreadNotification().then(function (res) {
            if (res.length) {
                vm.notiSet={
                    ori: res
                };
                vm.notiSet.unread = _.groupBy(res,'status')['false'];
                vm.notiSet.read = _.groupBy(res,'status')['true'];

                vm.hasUnreadNotification = !!vm.notiSet.unread;

            }
        });

        vm.markAsRead = markAsRead;

        //
        function markAsRead(){
            if (vm.hasUnreadNotification)

                notificationFactory.markAsRead().then(function () {
                    vm.hasUnreadNotification = false;
                    _.forEach(_.map(vm.notiSet.unread, function (n) {
                        n.status = true;
                        return n;
                    }), function (o) {
                        vm.notiSet.read.push(o);
                    });
                    vm.notiSet.unread = [];
                });

        }
    }
}())

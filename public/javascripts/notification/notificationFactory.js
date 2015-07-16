(function () {
    angular.module('notification')
        .factory('notificationFactory', notificationFactory)

        /* With a GET request, it will retrieve unread notification
         *  With a PUT request, it will mark all unread notification as read */
        .constant('NOTI_URL','/speedvocab/api/notification');

    function notificationFactory($http, NOTI_URL){
        return {
            getUnreadNotification: getUnreadNotification,
            markAsRead: markAsRead
        }

        //
        function getUnreadNotification(){
            return $http.get(NOTI_URL).then(function (res) {
                return res.data;
            })
        }
        function markAsRead(){
            return $http.put(NOTI_URL).then(function (res) {
                return res.data;
            })
        }
    }
}())
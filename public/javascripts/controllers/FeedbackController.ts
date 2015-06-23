/**
 * Created by chuso_000 on 22/6/2015.
 */
declare var app;
declare var _;
interface IFeedback{
    avatar : String;
    content: String;
    createdAt : Date;
}
class FeedbackController{
    $inject=['$http','helper'];
    fbList : IFeedback[] = [];
    content: String;
    avatar: String;
    constructor(public $http, public helper){
        this.getFeedbacks();
    }
    getFeedbacks(){
        this.$http.get('/speedvocab/api/getfeedbacks').then((res)=>{
            //console.log(res);
            this.fbList = this.helper.orderByDate(_.map(res.data, (o)=> {
                return {
                    avatar: o.avatar,
                    content: o.content,
                    createdAt: o.createdAt
                };
            }));
        });
    }
    submitFeedback(content: String){
        this.fbList.push({
            avatar: this.avatar,
            content: this.content,
            createdAt: new Date()
        });
        this.fbList = this.helper.orderByDate(this.fbList);
        this.content = null;
        this.$http.post('/speedvocab/post/addfeedback',{
            content: content
        }).then((res)=> {
            console.log(res);
        }).catch(console.error);
    }
}
app.controller('FeedbackCtrl', FeedbackController);
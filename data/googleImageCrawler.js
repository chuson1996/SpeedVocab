var Crawler = require("crawler");
var cheerio = require('cheerio');
var fs = require('fs');
var q = require('q');
function goCrawler(url) {
    var def = q.defer();
    var c = new Crawler({
        maxConnections : 1,

        // This will be called for each crawled page
        onDrain: function() {
            console.log('END.');
        },
        callback : function (error, result, $$) {
            if (error) return console.log(error);
            if (result){
                //console.log(result.body);

                var bodyHTML='';
                var bodyJSON=[];
                console.log('-------------------------------------------------------------');
                var $ = cheerio.load(result.body.toString());
                $('img').each(function(item,elem){
                    //console.log('elem src: ', $(elem).attr('src'));
                    if ((/tia.png/g).test($(elem).attr('src'))) return;
                    bodyHTML+='<img height="'+$(elem).attr('height')+'" width="'+$(elem).attr('width')+'" src="'+$(elem).attr('src')+'">';
                    bodyJSON.push($(elem).attr('src'));
                });

                return def.resolve(bodyJSON);
                //return fs.writeFile('result.html', bodyHTML, function (err) {
                //    if (err) def.reject(err);
                //    def.resolve('It\'s saved!')
                //    //console.log('It\'s saved!');
                //});

                //var page = result.body;
                //var res = page.match(/bechtel/i);
                //if (res && res.length>0){
                //    console.log(result.body);
                //}

            }
            else{
                def.reject('No result found');
                return;
            }
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            //$$('img.rg_i').each(function(index, a) {
            //    console.log('index',index);
            //    console.log('a',a);
            //    var toQueueUrl = $(a).attr('href');
            //    console.log(index+' : ',toQueueUrl);
            //    c.queue(toQueueUrl);
            //});
        }
    });
    c.queue({
        uri: 'https://www.google.fi/search?site=&tbm=isch&source=hp&q='+url.replace(' ','+'),
        retries:2,
    });
    return def.promise;
}

//goCrawler('cash');
module.exports = goCrawler;
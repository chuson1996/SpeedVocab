/**
 * Created by chuso_000 on 18/8/2015.
 */
describe('Main Controller', function () {
    var ctrl, $rootScope, scope, $stateParams, $controller, $httpBackend, $q;
    var createController;
    var getFoldersRequestHandler,
        getWordsRequestHandler,
        deleteFolderRequestHandler;
    beforeEach(module('controllers'));

    beforeEach(inject(function (_$rootScope_, _$httpBackend_, _$stateParams_, _$controller_, _$q_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $stateParams = _$stateParams_;
        $controller = _$controller_;
        $q = _$q_;

        getFoldersRequestHandler = $httpBackend.when('GET','/speedvocab/api/getfolders')
            .respond([{"_id":"55477a205234dd0c177278d0","userId":"554771ebc27a79641de2a15f","name":"NO NAME","fromLang":"fi","toLang":"ru","__v":0,"createdAt":"2015-05-04T13:54:40.000Z"},{"_id":"55488e267978be7816a88924","userId":"554771ebc27a79641de2a15f","name":"Chapter 7","fromLang":"fi","toLang":"en","__v":0,"createdAt":"2015-05-05T09:32:22.000Z"},{"_id":"55523881f1e7b37e0170419a","userId":"554771ebc27a79641de2a15f","name":"IT phrases","fromLang":"en","toLang":"vi","__v":0,"createdAt":"2015-05-12T17:29:37.000Z"},{"_id":"55588d69e281a87d01d096c3","userId":"554771ebc27a79641de2a15f","name":"TOTAL RECALL","fromLang":"en","toLang":"en","__v":0,"createdAt":"2015-05-17T12:45:29.000Z"},{"_id":"55c330a7507e3a03005942ee","userId":"554771ebc27a79641de2a15f","name":"Finnish Summer","fromLang":"fi","toLang":"en","__v":0,"createdAt":"2015-08-06T10:02:15.000Z"}]
        );
        getWordsRequestHandler = $httpBackend.when('GET','/speedvocab/api/getwords/55477a205234dd0c177278d0')
            .respond([{"_id":"55ce30352a00617c02040b42","folderId":"55c330a7507e3a03005942ee","word":"älä tupakoi","meaning":"Don't smoke","NoCorrectAns":3,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=älä+tupakoi&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=Don't+smoke&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-14T18:15:17.000Z"},{"_id":"55c33231507e3a03005942ef","folderId":"55c330a7507e3a03005942ee","word":"pystyä","meaning":"can, to be able to","example":"<p>You can <b>piss sta</b>nding!</p>","image":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTnt0u_sioi6gI2KjE1chaMQN6JU_Hl5MQDLUH1n55Np3lRWfDqgfCPHKY7","NoCorrectAns":9,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=pystyä&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=can,+to+be+able+to&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-06T10:08:49.000Z"},{"_id":"55c3326a507e3a03005942f0","folderId":"55c330a7507e3a03005942ee","word":"tietää","meaning":"to know","example":"<p>Tietätkö THEATRE?</p>","image":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQbLvTMmZg2AGWGzWNz4F3XGj47-urAi04HTjaBOmn0z0r4zUOckrketA","NoCorrectAns":9,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=tietää&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=to+know&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-06T10:09:46.000Z"},{"_id":"55c332ec507e3a03005942f1","folderId":"55c330a7507e3a03005942ee","word":"mukaan","meaning":"along, with","example":"<p>Tuletko mukaan? Come along?</p>","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZXqjVSBqHfQRiQGAajDdT3HQfCwm5HeK2ul3EK0e_Tw9pt4Kro-Rvgsg","NoCorrectAns":9,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=mukaan&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=along,+with&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-06T10:11:56.000Z"},{"_id":"55c3346d507e3a03005942f2","folderId":"55c330a7507e3a03005942ee","word":"pois","meaning":"out, away, off","example":"<pre>Lähdetkö pois? Are you going far away?</pre><pre>Mene pois. Go away.<br/></pre><pre>Hän otti jalat pois pöydältä. He took his feet off the desk.</pre>","image":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRNMNteGqmmFMZnIWs8COb6rkS3gNtL7mtohLEyq5PqqCB6lEqDco_f0fE","NoCorrectAns":9,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=pois&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=out,+away,+off&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-06T10:18:21.000Z"},{"_id":"55c3b142a6c1490300895e6b","folderId":"55c330a7507e3a03005942ee","word":"palvelu","meaning":"service","image":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRYiNcVIwxdJ9sFnzXU3nN2vwX9taJL6NdBxUDqLlPSQixaYWRRZgmzywM","NoCorrectAns":9,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=palvelu&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=service&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-06T19:10:58.000Z"},{"_id":"55ca22b026d3ca0300747d5c","folderId":"55c330a7507e3a03005942ee","word":"eipä kestä","meaning":"no problem","example":"<p>Kiitos -&gt; Eipä kestä</p>","image":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ4qtbmRMFQ5QrX9vzcLIpmvotaetuCpE1gr7UeGtJnIMDTbrV_VVmAO9H4","NoCorrectAns":6,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=eipä+kestä&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=no+problem&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-11T16:28:32.000Z"},{"_id":"55ca3bf86f94600300d0482a","folderId":"55c330a7507e3a03005942ee","word":"kotoisin","meaning":"from, t? ?âu","example":"<pre>Mistä olet kotoisin?</pre><pre>Olen kotoisin vietnami<u>sta</u></pre>","image":"","NoCorrectAns":6,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=kotoisin&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=from,+t?+?âu&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-11T18:16:24.000Z"},{"_id":"55ce2d8c2a00617c02040b3f","folderId":"55c330a7507e3a03005942ee","word":"tupakoi","meaning":"smoke","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqJG1Aud0IJHoZduB0IF5en6hSgmEsnhVuZFFa45Po2Y-Cm0a5VrQYmeE","NoCorrectAns":5,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=tupakoi&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=smoke&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-14T18:03:56.000Z"},{"_id":"55ce31652a00617c02040b44","folderId":"55c330a7507e3a03005942ee","word":"älä ota sitä","meaning":"Don't take it","example":"","image":"","NoCorrectAns":5,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=älä+ota+sitä&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=Don't+take+it&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-14T18:20:21.000Z"},{"_id":"55d09a3c2a00617c02040b55","folderId":"55c330a7507e3a03005942ee","word":"vihannes","meaning":"vegetable","image":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS-opO9RErI7Rsfo_EmvKfnc331JgELVtRIFx0xuVjHKBcH74OoZ5VseA","NoCorrectAns":0,"NoWrongAns":0,"wordVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sanna22k&req_text=vihannes&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","meaningVoice":"http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text=vegetable&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk","createdAt":"2015-08-16T14:12:12.000Z"}]
        );
        deleteFolderRequestHandler = $httpBackend.when('DELETE','/speedvocab/api/deletefolder/55477a205234dd0c177278d0')
            .respond('OK');




        createController = function() {
            return $controller('MainController', {'$scope' : scope });
        };

        //$httpBackend.flush();

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('ctrl when no folders is selected or opened', function () {
        it('should fetch folders', function () {
            ctrl = $controller('MainController', {
                $scope: scope,
            });
            expect(ctrl.currentOpeningFolder).toBeNull();
            $httpBackend.expectGET('/speedvocab/api/getfolders');
            $httpBackend.flush();
            expect(ctrl.folders.length).toEqual(5);
        });
        describe('ctrl.wordCart', function () {
            it('should be an empty array', function () {
                expect(ctrl.wordCart).toEqual([]);
            })
        });
        describe('Folder', function () {
            describe('Folder API', function () {
                it('should delete a folder', function () {
                    expect(ctrl.folders.length).toEqual(5);
                    var folderToDelete = {"_id":"55477a205234dd0c177278d0","userId":"554771ebc27a79641de2a15f","name":"NO NAME","fromLang":"fi","toLang":"ru","__v":0,"createdAt":"2015-05-04T13:54:40.000Z"};
                    var deleteFolderHandler = function (res) {
                        //$rootScope.$digest();
                        console.log('ákdfhakhdfkajhdsfkjah');
                        $httpBackend.expectDELETE('/speedvocab/api/deletefolder/55477a205234dd0c177278d0');
                        $httpBackend.flush();
                        expect(ctrl.folders.length).toEqual(6);
                    };
                    var deleteFolderSpy = jasmine.createSpy('deleteFolderHandler');
                    ctrl.deleteFolder(folderToDelete)
                        .then(deleteFolderHandler);
                    $httpBackend.expectDELETE('/speedvocab/api/deletefolder/55477a205234dd0c177278d0');
                    $httpBackend.flush();
                    expect(ctrl.folders.length).toEqual(6);

                    //$rootScope.$digest();
                    //expect(deleteFolderSpy).toHaveBeenCalled();


                })
            })
        });
    });
    describe('ctrl when a folder is selected or opened', function () {

        it ('should fetch words', function () {
            ctrl = $controller('MainController', {
                $scope: scope,
                $stateParams: {
                    fid: '55477a205234dd0c177278d0'
                }
            });
            //$httpBackend.expectGET('/speedvocab/api/getfolders');
            $httpBackend.expectGET('/speedvocab/api/getwords/55477a205234dd0c177278d0');
            $httpBackend.flush();
            expect(ctrl.currentOpeningFolder).toBeDefined();
            expect(ctrl.currentOpeningFolder).not.toBeNull();
            expect(ctrl.currentWordlist.length).toBeGreaterThan(0);

        });


    })
})

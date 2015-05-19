console.log()
module.exports ={
    cookieSecret: 'chuhoangson',
    mongo:{
        development:{
            connectionString: 'mongodb://admin:admin@ds031932.mongolab.com:31932/speedvocab'
        },
        production:{
            connectionString: 'mongodb://admin:admin@ds031932.mongolab.com:31932/speedvocab'
        }
    },
    authProviders:{
        facebook:{
            development:{
                appId:'446906415484442',
                appSecret:'f4f154478d932ba1d6873a03510d3c82',
                redirect_uri:'http://localhost:3000/'
            },
            production:{
                appId:'446906415484442',
                appSecret:'f4f154478d932ba1d6873a03510d3c82',
                redirect_uri:'http://localhost:3000/'
            }
        },
        google:{
            development:{
                appId:'1041106732841-f228s5bco39dvo8is9efu2lhnkcn8luv.apps.googleusercontent.com',
                appSecret:'PHVOgY3PQOR-6wiEuEBochBn',
                redirect_uri: 'http://localhost:3000/acount'
            },
            production:{
                appId:'1041106732841-f228s5bco39dvo8is9efu2lhnkcn8luv.apps.googleusercontent.com',
                appSecret:'PHVOgY3PQOR-6wiEuEBochBn',
                redirect_uri: 'http://localhost:3000/acount'
            }
        }
    },
    flickrapi:{
        api_key: "f8834d978b727928339f4c44000e32be",
        secret: "6bcbe215ff7675adr"
    }
};
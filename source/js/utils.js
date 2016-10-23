'use strict';

//NOTE: Adiciona em Arrays uma função para adicionar apenas elementos únicos
module.exports = (function () {
    let Error = require('common-errors');
    let Glob = require('glob');
    let Path = require('path');
    let Config = require('../config.json')

    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };
    let ErrorAlertFunc = ErrorAlert

    //Cria um DAO com MongoDB
    function createMongooseDAO(database) {
        if(database === undefined){
            ErrorAlertFunc(Error.Error('Error while trying to create DAO Object: db undefined'), true)
        }

        //Configure Database
        database.on('error', console.error.bind(console, 'connection error:'))

        // Retorna o objecto/função de DAO
        return function () {
            let Config = rootRequire('config.json')
            let db = database
            let version = Config.database.version

            // Vai sincronizar db com os schemas criados
            this.sync = function() {
                console.log('Starting to Sync db ... ')
                db.once('open', function() {

                    let mongoose = require('mongoose')
                    let glob = require('glob')
                    let path = require('path')

                    let files = glob.sync(__dirname + path.sep + 'schemas' + path.sep + '**.js')
                    let schemas = []
                    let notLoadedSchemas = []
                    let alreadyLoadedDependencies = []

                    // Iteração pelos caminhos dos schemas
                    files.forEach(function(file) { // pega os schemas de todos os files
                        let dirname = path.dirname(file)
                        let schema = require(dirname)
                        schemas.push(schema)

                        if(schema.meta.dependencies.length === 0) {
                            let mongooseSchema = mongoose.Schema(schema.schema(mongoose))
                            mongoose.model(schema.meta.tablename, mongooseSchema)

                            alreadyLoadedDependencies.push(schema.meta.name)
                        }else{
                            notLoadedSchemas.push(schema.meta.name)
                        }
                    })

                    //loop
                    console.log('Loading dependencies ... ')
                    while(notLoadedSchemas.length > 0) {
                        notLoadedSchemas.forEach(function (s) {
                            s.meta.dependencies.forEach(function (d) {
                                if(alreadyLoadedDependencies.contains(d)) {
                                    console.log('loading dependency ' + s.meta.name)
                                    alreadyLoadedDependencies.push(s.meta.name)

                                    let mongooseSchema = mongoose.Schema(s.schema(mongoose))
                                    mongoose.model(s.meta.tablename, mongooseSchema)
                                    notLoadedSchemas.remove(notLoadedSchemas.indexOf(s))
                                    return
                                }
                            })
                        })
                    }

                    console.log('Dependencies loaded!')

                })
            }
        }

    }

    //Cria um DAO usando a lógica de SQLITE
    function createSqliteDAO(){
        let Sequelize = require('sequelize')
        console.log('Creating DB ... ')
        try {

            let db = new Sequelize('sqlite://campaing-compendium.sqlite', {dialect: 'sqlite'})
        } catch(err) {
            alert(err.message)
        }
        loadSqliteModels(sequelize, db).then(function () {
            //TODO: Se quiser adicionar algo depois da promise, adicionar aqui
            console.log('DB created!');
        })

        // Cria um prototype que será usado no db que vai ser "publico". Com funções limitadas
        let mockupDbPrototype = db.prototype;
        mockupDbPrototype.query = undefined
        mockupDbPrototype.dropSchema = undefined
        mockupDbPrototype.sync = undefined
        mockupDbPrototype.dropAllSchemas = undefined
        mockupDbPrototype.drop = undefined
        mockupDbPrototype.createSchema = undefined
        let mockupDb = {}
        Object.setPrototypeOf(mockupDbPrototype, mockupDb)
        return mockupDb

    }

    function loadSqliteModels(sequelize, db) {
        console.log('Loading Models')
        let CampaingModel = sequelize.define('Campaing', {
            id: {
                type: sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: sequelize.STRING
            },
            plot: {
                type: sequelize.TEXT
            }
        })

        let ChapterModel = sequelize.define('Chapter', {
            id: {
                type: sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: sequelize.STRING
            },
            description: {
                type: sequelize.TEXT
            }
        })

        let HandoutModel = sequelize.define('Handout', {
            id: {
                type: sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: sequelize.STRING
            },
            uri: {
                type: sequelize.STRING
            }
        })

        let MilestoneModel = sequelize.define('Milestone', {
            id: {
                type: sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: sequelize.STRING
            },
            description: {
                type: sequelize.TEXT
            }
        })

        let NPCModel = sequelize.define('NPC', {
            id: {
                type: sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: sequelize.STRING
            },
            description: {
                type: sequelize.TEXT
            }
        })

        CampaingModel.belongsToMany(NPCModel, {through : 'CampaignNpc'})
        NPCModel.belongsToMany(CampaingModel, {through : 'CampaignNpc'})
        ChapterModel.belongsTo(CampaingModel)
        ChapterModel.hasMany(MilestoneModel)
        MilestoneModel.hasMany(HandoutModel)
        console.log('Initializing db sync ...');
        return db.sync()
    }

    //TODO: achar um jeito de criar MongoDB sem precisar instalar, ou de instalar ele junto com o programa
    // this.DAO = createMongooseDAO(loadMongoose())
    this.DAO = createSqliteDAO()
})();

// Função para popar um alerta de erro na tela
function ErrorAlert (err, isDeveloper) {
    let errorMessage = getLanguageJson()[0]
    alert(errorMessage.unhandledError);
    console.log(err.message, 'isDeveloper:' + isDeveloper);

    if(isDeveloper) {
        let nw = require('nw.gui')
        let win = nw.Window.get();
        win.close()
    }
}

// Adiciona o getLanguageJson na função, para que não haja problema de escopo
ErrorAlert.prototype.getLanguageJson = getLanguageJson;

function getLanguageJson () {
    let Config = require('../config.json');

    let localeJson = Glob.sync(__dirname + Path.sep + '..' + Path.sep + 'lang' + Path.sep + Config.lang + '.json')

    if (localeJson.length > 0) {
        return localeJson
    }

    throw Error.Error('Error while loading the language json (doesn\'t exist)')

};

// Quando usar o Mongoose, cria um DB em MongoDB
function loadMongoose (uri) {
    if(uri === undefined) {
        uri = 'mongodb://localhost/campaing-compendium'
    }
    try {

        let mongoose = require('mongoose')
        mongoose.connect(uri)

        return mongoose.connection // Retorna o DB
    } catch (err) {
        ErrorAlert(err, true);
    }

}

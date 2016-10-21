
module.exports = (function () {
    return {
        //NOTE: Necessário criar como função, pois assim não existe problema de execução quando buscar este js
        schema: function(mongoose) {
            return {
                name: 'string',
                imgUri: 'string',
                created: {
                    type: Date,
                    default: Date.now
                },
                updated: {
                    type: Date,
                    default: Date.now
                }
            }
        },
        meta: {
            dependencies: [],
            name: 'handout',
            tableName: 'Handout'
        }
    }
})()

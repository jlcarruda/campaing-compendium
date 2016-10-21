
module.exports = (function () {
    return {
        //NOTE: Necessário criar como função, pois assim não existe problema de execução quando buscar este js
        schema: function(mongoose) {
            return {
                name: 'string',
                description: 'string',
                milestones: [mongoose.model('Milestone').schema],
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
            dependencies: ['milestone'],
            name: 'chapter',
            tableName: 'Chapter'
        }
    }
})()


module.exports = (function () {
    return {
        //NOTE: Necessário criar como função, pois assim não existe problema de execução quando buscar este js
        schema: function (mongoose){
            return {
                name: 'string',
                system: 'string',
                description: {
                    type: 'string',
                    default: ''
                },
                plot: {
                    type: 'string',
                    default: ''
                },
                created: {
                    type: Date,
                    default: Date.now
                },
                chapters: [mongoose.model('Chapter').schema],
                npcs: [mongoose.model('NPC').schema]
            }
        },
        meta: {
            dependencies: ['chapter', 'npc'],
            name: 'campaing',
            tableName: 'Campaing'
        }
    }
})()

/**
 * 
 */

var dev_level = {
    world: {
        width:5000,
        height: 5000
    },
    layers: [{
            type: Scene.type.canvas2D,
            id: 'layer_background',
            index: 0,
            entities: [{
                    name: 'background',
                    params: {
                        position: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                    }
            }]
    },{
        type: Scene.type.canvas2D,
        id: 'layer_play',
        index: 10,
        entities: [{
            name: 'player',
            params: {
                position: {
                    x: 0,
                    y: 15,
                    z: 0
                }
            }
        }, {
            name: 'entity_spawner',
            params: {
                rate: 1,
                spawn_type: 'enemy',
                continuous: true
            }
        }, {
            name: 'entity_spawner',
            params: {
                rate: 5,
                spawn_type: 'enemy2',
                continuous: true
            }
        }]
    }]
};
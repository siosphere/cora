/**
 * 
 */


var Game = Cora.system.create({
    init: function(){
        this.tick_index = Cora.register(Cora.events.TICK, this.tick);
        this.__proto__.init();
    },
    
    start: function(){
        this.__proto__.start();
    },
    
    tick: function(){
        
    },
    
    begin: function(){
        
        
        //todo move to level loader
        dev_level.entities.forEach(function(entity){
            var entity = Entity.createByName(entity.name, entity.params);
            Entity.place(entity);
        });
        
    }
});


var dev_level = {
    entities: [{
            name: 'player',
            params: {
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
    }]
};
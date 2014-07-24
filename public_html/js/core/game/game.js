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
        
        /*Entity.dispatch(Entity.actions.CREATE, {
            init: function(){
                var geometry = new THREE.BoxGeometry(1,1,1);
                var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                var cube = new THREE.Mesh( geometry, material );
                this.mesh = cube;
            },
            can_tick: true,
            tick: function(){
                //var position = this.get('position');
                //position.x -= 0.1;
                //this.set('position', position);
            }
        });*/
    }
});


var dev_level = {
    entities: [{
            name: 'test_entity',
            params: {
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
    }]
};
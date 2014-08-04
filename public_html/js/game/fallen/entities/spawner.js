/**
 * 
 */

var EntitySpawner = Entity.create('entity_spawner', {
    rate: 1,
    continuous: false,
    spawn_type: null,
    can_tick: true,
    lastSpawn: false,
    tick: function(){
        if(!Network.is_host){
            return;
        }
        //spawn at my location
        //console.log(Game.clock.getElapsedTime());
        if(!this.lastSpawn || Game.clock.getElapsedTime() - this.rate > this.lastSpawn){
            this.lastSpawn = Game.clock.getElapsedTime();
            //Fallen.addEnemy();
            var entity = Entity.createByName(this.spawn_type);
            Entity.place(entity, this.layer_id);
            Network.spawnEntity(entity);
            
        }
    },
    draw: function(){
        
    }
});
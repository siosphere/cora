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
        //spawn at my location
        //console.log(Game.clock.getElapsedTime());
        if(!this.lastSpawn || Game.clock.getElapsedTime() - this.rate > this.lastSpawn){
            this.lastSpawn = Game.clock.getElapsedTime();
            //Fallen.addEnemy();
            Entity.place(Entity.createByName(this.spawn_type), this.layer_id);
        }
    },
    draw: function(){
        
    }
});
/**
 * 
 */


var BaseWeapon = Entity.create('base_weapon', {
    init: function(){
        //this.texture = Asset.loadImage('media/laser.png');
    },
    damage: 20,
    rate: 0.5,
    last_fired: null,
    fire: function(){
        
        if(this.last_fired === null || this.last_fired + this.rate <= Game.clock.getElapsedTime()){
            
             var player = Fallen.getPlayer();
            var player_position = player.position;
            var projectile = Entity.createByName('projectile');
            projectile.position = Vector.copy(player.position);
            projectile.position.x += player.width;
            projectile.position.y = projectile.position.y + (player.height / 2);
            Entity.place(projectile);
            
            this.last_fired = Game.clock.getElapsedTime();
            //find what entities line within my sights
            var line_of_sight = [];
            var weapon = this;
            Entity.entities.filter(Entity.filterType(Entity.type.NPC)).forEach(function(entity){
                if(entity === false){
                    return false;
                }
                if(entity.position.x > player_position.x && entity.position.y >= player_position.y && entity.position.y <= (player_position.y + player.height)
                        && entity.position.x <= window.innerWidth){
                    line_of_sight.push(entity);
                }
            });
            line_of_sight.sort(function(a, b){
                return a.position.x - b.position.x;
            }).forEach(function(entity){
                entity.onDamage(weapon.damage);
            });
        }
        
    },
    can_tick: true,
    tick: function(){
        
    }
});

var Projectile = Entity.create('projectile', {
    init: function(){
        
        var laserRect = new Rect({
            x: 0,
            y: 0,
            width: 46,
            height: 16
        });
        
        this.texture = new Texture({
            image: Asset.loadImage('media/laser.png'),
            width: laserRect.width,
            height: laserRect.height,
            x: 0,
            y: 0,
            sourceWidth: laserRect.width,
            sourceHeight: laserRect.height
        });
    },
    draw: function(){
        this.texture.x = this.position.x;
        this.texture.y = this.position.y;
        this.texture.draw();
        this.position.x += this.speed;
    },
    speed: 160
});
/**
 * 
 */


var Enemy = Entity.create('enemy', {
    type: Entity.type.NPC,
    networkable: true,
    init: function(){
        
        Network.send_table(this.name);
        Network.send_variable('position');
        Network.send_variable('velocity');
        Network.send_variable('alive');
        Network.end_send_table();
        
        Network.recv_table(this.name);
        Network.recv_variable('position', function(entity, value){
            entity.position = LERP(entity.position, value);
        });
        Network.recv_variable('velocity', function(entity, value){
            entity.velocity = LERP(entity.velocity, value);
        });
        Network.recv_variable('alive', function(entity, value){
            entity.alive = value;
            if(!value){
                entity.die();
            }
        });
        Network.end_recv_table();
        
        
        /*Network.start_table(this.name);
        Network.variable('position');
        Network.variable('velocity');
        Network.end_table();
        
        //recv table
        
        Network.recv_table(this.name);
        Network.variable('position', function(position){
            
        });
        Network.end_recv_table();*/
        
        this.sourceRect = new Rect({
            x: 0,
            y: 0,
            width: 47,
            height: 61
        });
        
        this.texture = new Texture({
            image: Asset.loadImage('media/mineAnimation.png')
        });
        
        this.explodeRect = new Rect({
            x: 0,
            y: 0,
            width: 134,
            height: 134
        });
        
        this.explode = new Texture({
            image: Asset.loadImage('media/explosion.png')
        });
        
        this.sprite = new AnimatedSprite({
            texture: this.texture,
            frameWidth: this.width,
            frameHeight: this.height,
            frameCount: 7,
            sourceRect: this.sourceRect
        });
        
        this.explosion = new AnimatedSprite({
            texture: this.explode,
            frameWidth: this.width,
            frameHeight: this.height,
            frameCount: 12,
            sourceRect: this.explodeRect,
            loop: false
        });
        
        this.position = new Vector.zero();
        this.velocity = new Vector.zero();
        this.deathSound = Asset.loadAudio('media/sound/explosion.wav');
    },
    spawn: function(){
        if(Network.is_host){
            this.position.x = Camera.screenX(1920 + 115);
            console.log('spawn', this.position.x);
            this.position.y = Math.random() * (Camera.screenY(1080) - this.height);
            this.velocity.x = -1;
        } else {
            console.log('spawned', this.position.x);
        }
    },
    can_tick: true,
    tick: function(){
        if(this.alive){
            //console.log(this.position.x);
            var alive = this.alive;
            var position = Vector.copy(this.position);
            var velocity = Vector.copy(this.velocity);
            var speed = this.speed;
            
            position.x += velocity.x * speed;
            if(this.sprite !== null){
                position.y -= velocity.y * speed;
            } else {
                position.y += velocity.y * speed;
            }
            position.z += velocity.z * speed;
            //this.position = position;
            //console.log(this.velocity);
            //this.set('position', position);

            this.sprite.position = this.position;

            //velocity falloff
            /*if(velocity.x < 0 ){
                velocity.x = clamp(-100, 0, velocity.x += 0.05);
            } else {
                velocity.x = clamp(0, 100, velocity.x -= 0.05);
            }
            if(velocity.y < 0 ){
                velocity.y = clamp(-100, 0, velocity.y += 0.05);
            } else {
                velocity.y = clamp(0, 100, velocity.y -= 0.05);
            }
            if(velocity.z < 0 ){
                velocity.z = clamp(-100, 0, velocity.z += 0.05);
            } else {
                velocity.z = clamp(0, 100, velocity.z -= 0.05);
            }*/
            
            Entity.dispatch(Entity.actions.UPDATE, {
                entity_id: this.id,
                update: {
                    velocity: velocity,
                    position: position
                }
            });
            
        } else {
            if(Game.clock.getElapsedTime() - 1 >= this.diedTime){
                Entity.remove(this.id);
                this.can_tick = false;
            }
        }
    },
    speed: 5,
    width: 47,
    height: 61,
    collide: true,
    damage: 5,
    health: 15,
    onCollide:function(target){
        target.updateHealth(target.health - this.damage);
        this.die();
    },
    die: function(){
        
        Entity.dispatch(Entity.actions.UPDATE, {
            entity_id: this.id,
            update: {
                alive: false,
                diedTime: Game.clock.getElapsedTime(),
                collide: false
            }
        });
        
        this.deathSound.play();
    },
    draw: function(){
        if(this.alive){
            this.sprite.draw();
        } else {
            this.explosion.draw();
        }
    },
    onDamage: function(damage, entity){
        this.health -= damage;
        if(this.health <= 0){
            this.die();
        }
    },
    alive: true,
    diedTime: null
});
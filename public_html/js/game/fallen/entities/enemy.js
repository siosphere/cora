/**
 * 
 */


var Enemy = Entity.create('enemy', {
    type: Entity.type.NPC,
    networkable: true,
    init: function(){
        
        Network.start_table(this.name);
        Network.variable('position');
        Network.end_table();
        
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
        this.deathSound = Asset.loadAudio('media/sound/explosion.wav');
    },
    spawn: function(){
        this.position.x = window.innerWidth + 115;
        this.position.y = Math.random() * (window.innerHeight - this.height);
    },
    can_tick: true,
    tick: function(){
        if(this.alive){
            var position = this.position;;
            position.x -= this.speed;
            if(this.position.x <= -this.width){
                this.alive = false;
            }
            this.set('position', position);
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
        this.sprite = this.explosion;
        this.alive = false;
        this.diedTime = Game.clock.getElapsedTime();
        this.collide = false;
        this.deathSound.play();
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
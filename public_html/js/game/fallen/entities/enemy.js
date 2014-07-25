/**
 * 
 */


var Enemy = Entity.create('enemy', {
    init: function(){
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
    onCollide:function(target){
        target.health -= this.damage;
        this.sprite = this.explosion;
        this.alive = false;
        this.diedTime = Game.clock.getElapsedTime();
        this.collide = false;
    },
    alive: true,
    diedTime: null
});
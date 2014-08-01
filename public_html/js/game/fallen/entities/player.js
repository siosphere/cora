/**
 * 
 */


var FallenPlayer = Entity.create('player', {
    height: 69,
    width: 115,
    type: Entity.type.MODEL,
    init: function(){
        
        
        this.weapon = Entity.createByName('base_weapon');
        
        var sourceRect = new Rect({
            x: 0,
            y: 0,
            width: 115,
            height: 69
        });
        
        var texture = new Texture({
            image: Asset.loadImage('media/shipAnimation.png')
        });
        
        this.sprite = new AnimatedSprite({
            texture: texture,
            frameWidth: this.width,
            frameHeight: this.height,
            frameCount: 7,
            sourceRect: sourceRect
        });
        
        this.speed = 1;
        
        /*var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        this.mesh = cube;
        
        Fallen.player_entity_id = this.id;*/
        
        Fallen.player_entity_id = this.id;
        
        
    },
    fire: function(){
        this.weapon.fire();
    },
    can_tick: true,
    tick: function(){
        var position = this.get('position');
        var velocity = this.get('velocity');
        var speed = this.get('speed');
        
        position.x += velocity.x * speed;
        if(this.sprite !== null){
            position.y -= velocity.y * speed;
        } else {
            position.y += velocity.y * speed;
        }
        position.z += velocity.z * speed;
        
        
        if(position.y < 0){
            velocity.y = 0;
            position.y = 0;
        }
        if(position.y + this.height > window.innerHeight){
            velocity.y = 0;
            position.y = window.innerHeight - this.height;
        }
        
         if(position.x < 0){
            velocity.x = 0;
            position.x = 0;
        }
        if(position.x + this.width > window.innerWidth){
            velocity.x = 0;
            position.x = window.innerWidth - this.width;
        }
        
        this.set('position', position);
        
        this.sprite.position = this.position;
        //console.log(this.position);
        
        //velocity falloff
        if(velocity.x < 0 ){
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
        }

        this.set('velocity', velocity);
    },
    velocity: new Vector.zero(),
    speed: 0.2,
    health: 100,
    collide: true,
    updateHealth: function(health){
        this.health = health;
        UI.dispatch(UI.actions.UPDATE_PANEL, {
            panel_id: Fallen.hud.id,
            update: {
                health: health
            }
        });
    }
});
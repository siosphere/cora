/**
 * 
 */


var FallenPlayer = Entity.create('player', {
    networkable: true,
    height: 69,
    width: 115,
    type: Entity.type.MODEL,
    client_id: null,
    fired: false,
    init: function(){
        
        //this.set('position', new Vector.zero());
        
        this.position = new Vector.zero();
        
        Network.send_table(this.name);
        Network.send_variable('position');
        Network.send_variable('client_id');
        Network.send_variable('fired');
        Network.end_send_table();
        
        Network.recv_table(this.name);
        Network.recv_variable('position', function(entity, value){
            entity.position = LERP(entity.position, value);
        });
        Network.recv_variable('client_id', function(entity, value){
            entity.client_id = value;
        });
        Network.recv_variable('fired', function(entity, value){
            entity.fired = value;
            entity.fire();
        });
        Network.end_recv_table();
        
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
        
        this.velocity = new Vector.zero();
    },
    spawn: function(){
        if(Fallen.player_entity_id === null && (this.client_id === null || this.client_id === Network.client_id)){
            Fallen.player_entity_id = this.id;
            this.weapon.player_id = this.id;
        }
    },
    doFire: function(){
        Entity.dispatch(Entity.actions.UPDATE, {
            entity_id: this.id,
            update: {
                fired: true
            }
        });
    },
    fire: function(){
        this.weapon.fire();
        this.fired = false;
    },
    can_tick: true,
    tick: function(){
        //if(this.client_id === Network.client_id){
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


            if(position.y < 0){
                velocity.y = 0;
                position.y = 0;
            }
            if(position.y + this.height > window.innerHeight + Math.abs(Camera.y)){
                velocity.y = 0;
                position.y = (window.innerHeight - this.height) + Math.abs(Camera.y);
            }

             if(position.x < 0){
                velocity.x = 0;
                position.x = 0;
            }
            if(position.x + this.width > window.innerWidth + Math.abs(Camera.x)){
                velocity.x = 0;
                position.x = (window.innerWidth - this.width) + Math.abs(Camera.x);
            }
            //this.position = position;
            //console.log(this.velocity);
            //this.set('position', position);

            this.sprite.position = this.position;

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
            
            var fired = this.fired;
            if(fired){
                fired = false;
                this.fire();
            }
            
            Entity.dispatch(Entity.actions.UPDATE, {
                entity_id: this.id,
                update: {
                    velocity: velocity,
                    position: position,
                    fired: fired
                }
            });
            
            //this.set('velocity', velocity);
        //}
    },
    velocity: null,
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
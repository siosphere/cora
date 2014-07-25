/**
 * 
 */

var Fallen = Cora.system.create({
    game_state: null,
    player_entity_id: null,
    init: function(){
        Cora.register(Cora.events.TICK, this.tick);
        Cora.register(Cora.events.INPUT, this.input);
    },
    start: function(){
        this.setup_ui();
        this.load_entities();
    },
    tick: function(){
        Fallen.movement();
    },
    setup_ui: function(){
        this.main_menu = UI.createPanel({
            view: MainMenu,
            timer: 0,
            visible: true
        });
        UI.register(this.main_menu);
        var $me = this;
        Cora.register(Cora.events.INPUT, function(payload){
            if(payload.action == Input.action.KEYUP){
                var payload = payload.payload;
                if(payload.key == 27){
                    UI.dispatch(UI.actions.UPDATE_PANEL, {
                        panel_id: $me.main_menu.id,
                        update: {
                            visible: !$me.main_menu.visible
                        }
                    });
                }
            }
        });
        
    },
    load_entities: function(){
        SCRIPT('./game/fallen/entities/background.js');
        SCRIPT('./game/fallen/entities/test.js');
        SCRIPT('./game/fallen/entities/player.js');
    },
    input: function(payload){
        switch(payload.action){
            case Input.action.KEYUP:
                //Fallen.keyUp(payload.payload);
                Input._keyUp[payload.payload.key] = true;
                Input._keyDown[payload.payload.key] = false;
                break;
            case Input.action.KEYDOWN:
                Input._keyUp[payload.payload.key] = false;
                Input._keyDown[payload.payload.key] = true;
                //Fallen.keyUp(payload.payload);
                break;
        }
    },
    movement: function(){
        
        var player = Entity.getEntity(Fallen.player_entity_id);
            if(!player){
                return false;
            }
        
        if(Input._keyDown[Keyboard.UP]){
            //movement, move to movement handler
            var velocity = player.velocity;
            velocity.y += 1;
            Entity.dispatch(Entity.actions.UPDATE, {
                entity_id: player.id,
                update: {
                    velocity: velocity
                }
            });
        } else if(Input._keyDown[Keyboard.DOWN]){
            //movement, move to movement handler
            var velocity = player.velocity;
            velocity.y -= 1;
            Entity.dispatch(Entity.actions.UPDATE, {
                entity_id: player.id,
                update: {
                    velocity: velocity
                }
            });
        } else if(Input._keyDown[Keyboard.LEFT]){
            //movement, move to movement handler
            var velocity = player.velocity;
            velocity.x -= 1;
            Entity.dispatch(Entity.actions.UPDATE, {
                entity_id: player.id,
                update: {
                    velocity: velocity
                }
            });
        } else if(Input._keyDown[Keyboard.RIGHT]){
            var velocity = player.velocity;
            velocity.x += 1;
            Entity.dispatch(Entity.actions.UPDATE, {
                entity_id: player.id,
                update: {
                    velocity: velocity
                }
            });
        }
    }
});
/**
 * 
 */

var Fallen = Cora.system.create({
    game_state: null,
    player_entity_id: null,
    getPlayer: function(){
        return Entity.getEntity(this.player_entity_id);
    },
    init: function(){
        Cora.register(Cora.events.GAME, this.game_state_change);
        Cora.register(Cora.events.TICK, this.tick);
        Cora.register(Cora.events.INPUT, this.input);
        Cora.register(Cora.events.ASSET, this.assets_loaded);
    },
    start: function(){
        //this.setup_ui();
        this.load_entities();
        this.load_sound();
    },
    assets_loaded: function(payload){
        if(payload.loaded === true){
            Fallen.setup_ui();
        }
    },
    tick: function(){
        if(!Game.running){
            return false;
        }
        
        Fallen.movement();
        Fallen.combat();
    },
    setup_ui: function(){
        this.main_menu = UI.createPanel({
            view: MainMenu,
            timer: 0,
            visible: true
        });
        UI.register(this.main_menu);
        
        this.hud = UI.createPanel({
            view: UserHud,
            health: 0,
            visible: false
        });
        
        UI.register(this.hud);
        
        var $me = this;
        
        Cora.register(Cora.events.INPUT, function(payload){
            if(payload.action == Input.action.KEYUP){
                var payload = payload.payload;
                if(payload.key == 27){
                    switch(Game.current_state){
                        case Game.state.PAUSE:
                            Game.dispatch(Game.actions.STATE_CHANGE, {
                                state: Game.state.RESUME
                            });
                            break;
                        case Game.state.BEGIN:
                        case Game.state.RESUME:
                            Game.dispatch(Game.actions.STATE_CHANGE, {
                                state: Game.state.PAUSE
                            });
                            break;
                    }
                }
            }
        });
        
    },
    load_entities: function(){
        SCRIPT('./game/fallen/entities/background.js');
        SCRIPT('./game/fallen/entities/spawner.js');
        SCRIPT('./game/fallen/entities/test.js');
        SCRIPT('./game/fallen/entities/player.js');
        SCRIPT('./game/fallen/entities/enemy.js');
        SCRIPT('./game/fallen/entities/enemy2.js');
        SCRIPT('./game/fallen/entities/base_weapon.js');
        SCRIPT('./game/fallen/levels/dev_level.js');
    },
    load_sound: function(){
        this.game_music = Asset.loadAudio('media/sound/gameMusic.mp3', function(){
        });
        
        this.menu_music = Asset.loadAudio('media/sound/menuMusic.mp3');
        this.menu_music.play();
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
    combat: function(){
        var player = Fallen.getPlayer();
        if(!player){
            return false;
        }
        
        if(Input._keyDown[Keyboard.SPACE]){
            player.fire();
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
    },
    on_begin: function(){
        Game.loadLevel(dev_level);
        UI.dispatch(UI.actions.UPDATE_PANEL, {
            panel_id: this.hud.id,
            update: {
                health: Fallen.getPlayer().health
            }
        });
    },
    game_state_change: function(payload){
        var action = payload.action;
        var payload = payload.payload;
        switch(action){
            case Game.actions.STATE_CHANGED:
                var new_state = payload.state;
                switch(new_state){
                    case Game.state.BEGIN:
                         Game.begin();
                         Fallen.on_begin();
                         Fallen.menu_music.pause();
                         Fallen.game_music.play();
                         Fallen.togglePanel(Fallen.main_menu);
                         Fallen.togglePanel(Fallen.hud);
                        break;
                    case Game.state.RESUME:
                        Fallen.menu_music.pause();
                        Fallen.game_music.play();
                        Fallen.togglePanel(Fallen.main_menu);
                        Fallen.togglePanel(Fallen.hud);
                        break;
                    case Game.state.PAUSE:
                        Fallen.menu_music.play();
                        Fallen.game_music.pause();
                        Fallen.togglePanel(Fallen.main_menu);
                        Fallen.togglePanel(Fallen.hud);
                        break;
                    case Game.state.END:
                        break;
                }
                break;
        }
    },
    togglePanel: function(panel){
        UI.dispatch(UI.actions.UPDATE_PANEL, {
            panel_id: panel.id,
            update: {
                visible: !panel.visible
            }
        });
    }
});
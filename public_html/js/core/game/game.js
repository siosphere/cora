/**
 * 
 */


var Game = Cora.system.create({
    actions: {
        STATE_CHANGE: 'GAME_STATE_CHANGE',
        STATE_CHANGED: 'GAME_STATE_CHANGED'
    },
    state: {
        BEGIN: 'GAME_STATE_BEGIN',
        PAUSE: 'GAME_STATE_PAUSE',
        RESUME: 'GAME_STATE_RESUME',
        END: 'GAME_STATE_END'
    },
    current_state: null,
    running: false,
    init: function(){
        this.tick_index = Cora.register(Cora.events.TICK, this.tick);
        
        Cora.register(Cora.events.GAME, this.game_event);
        
        this.clock = new THREE.Clock(true);
        this.__proto__.init();
    },
    
    game_event: function(payload){
        var action = payload.action;
        var payload = payload.payload;
        switch(action){
            case Game.actions.STATE_CHANGE:
                console.log('changed my state!');
                Game.current_state = payload.state;
                Game.dispatch(Game.actions.STATE_CHANGED, {
                    state: Game.current_state
                });
                break;
        }
    },
    
    start: function(){
        this.__proto__.start();
    },
    
    tick: function(){
        
    },
    
    begin: function(){
        
        Game.running = true;
        //todo move to level loader
        dev_level.entities.forEach(function(entity){
            var entity = Entity.createByName(entity.name, entity.params);
            Entity.place(entity);
        });
        
    },
    /**
     * Dispatch an entity action
     * @param {type} action
     * @param {type} payload
     * @returns {undefined}
     */
    dispatch: function(action, payload){
        Cora.dispatch(Cora.events.GAME, {
            action: action,
            payload: payload
        });
    }
});


var dev_level = {
    entities: [{
                name: 'background',
                params: {
                    position: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                }
            },{
            name: 'player',
            params: {
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
    }]
};
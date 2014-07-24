/**
 * 
 */

var Fallen = Cora.system.create({
    game_state: null,
    init: function(){
        Cora.register(Cora.events.TICK, this.tick);
    },
    start: function(){
        this.setup_ui();
        this.load_entities();
    },
    tick: function(){
        
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
        SCRIPT('./game/fallen/entities/test.js');
    }
});
/**
 * 
 */


var UI = Cora.system.create({
    panels: [],
    init: function(){
        Cora.register(Cora.events.TICK, this.tick);
        Cora.register(Cora.events.UI, this.update);
    },
    start: function(){
        React.renderComponent(Viewport(), document.getElementById('ui_viewport'));
    },
    register: function(panel){
        panel.id = this.panels.length;
        this.panels.push(panel);
        this.dispatch(UI.actions.NEW_PANEL, {
            panel: panel
        });
    },
    tick: function(){
        var update_ui = false;
        UI.panels.forEach(function(panel){
            if(panel.needs_update){
                panel.needs_update = false;
                update_ui = true;
            }
            if(panel.can_tick){
                panel.tick();
            }
        });
        if(update_ui){
            UI.dispatch(UI.actions.UPDATE, {});
        }
    },
    createPanel: function(params){
        var panel = Object.create(UI_Panel);
        for(var i in params){
            panel[i] = params[i];
        }
        return panel;
    },
    updatePanel: function(payload){
        this.panels.forEach(function(panel){
            if(panel.id == payload.panel_id){
                for(var i in payload.update){
                    panel.set(i, payload.update[i]);
                }
            }
        });
    },
    update: function(payload){
        switch(payload.action){
            case UI.actions.UPDATE_PANEL:
                UI.updatePanel(payload.payload);
                break;
        }
    },
    /**
     * Dispatch an entity action
     * @param {type} action
     * @param {type} payload
     * @returns {undefined}
     */
    dispatch: function(action, payload){
        Cora.dispatch(Cora.events.UI, {
            action: action,
            payload: payload
        });
    },
    actions: {
        NEW_PANEL: 'UI_ACTION_NEW',
        UPDATE: 'UI_ACTION_UPDATE',
        UPDATE_PANEL: 'UI_ACTION_UPDATE_PANEL'
    }
});


var UI_Panel = {
    can_tick: false,
    tick: function(){
        
    },
    width: null,
    height: null,
    x: null,
    y: null,
    id: null,
    className: '',
    view: null,
    visible: true,
    get: function(i){
        return this[i];
    },
    set: function(i, value){
        this[i] = value;
        this.needs_update = true;
        return this;
    },
    needs_update: false
};
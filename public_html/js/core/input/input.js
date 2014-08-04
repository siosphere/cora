/**
 * 
 */


var Input = Cora.system.create({
    states: {}, //states per player
    _keyDown: [],
    _keyUp: [],
    init: function(){
        window.onkeyup = function(e){
            Input.dispatch(Input.action.KEYUP, {
                key: e.keyCode
            });
        };
        window.onkeydown = function(e){
            Input.dispatch(Input.action.KEYDOWN, {
                key: e.keyCode
            });
        };
    },
    dispatch: function(action, payload){
        Cora.dispatch(Cora.events.INPUT, {
            action: action,
            payload: payload
        });
    },
    action: {
        KEYDOWN: 'INPUT_ACTION_KEYDOWN',
        KEYUP: 'INPUT_ACTION_KEYUP'
    }
});

var InputState = function(){
    return {
        keys: {}
    };
};
/**
 * 
 */


var Input = Cora.system.create({
    init: function(){
        window.onkeyup = function(e){
            Input.dispatch(Input.action.KEYUP, {
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
/**
 * 
 */



var SCRIPT = function(path, callback){
    var script = document.createElement('script');
    script.src = './js/' + path;
    script.onload = callback;
    document.head.appendChild(script);
    console.log(script);
};

var MERGE = function(obj_a, obj_b){
    for(var i in obj_b){
        obj_a[i] = obj_b[i];
    }
    return obj_a;
};

Vector = {
    x: null,
    y: null,
    z: null,
    zero: function(){
        return {
            x: 0,
            y: 0,
            z: 0
        };
    }
};


var KEYBOARD = {
    ESC: 27,
    UP: 1,
    DOWN: 1,
    LEFT: 1,
    RIGHT: 1,
    SPACE: 1
};
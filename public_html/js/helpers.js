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


var Keyboard = {
    ESC: 27,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
};



var clamp = function(min, max, value){
    if(value > max){
        value = max;
    }
    if(value < min){
        value = min;
    }
    return value;
}
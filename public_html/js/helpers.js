/**
 * 
 */



var SCRIPT = function(path, callback){
    if(typeof(Asset) !== 'undefined'){
        Asset.loadScript(path, callback);
    } else {
        var script = document.createElement('script');
        script.src = './js/' + path;
        script.onload = callback;
        document.head.appendChild(script);
        console.log(script);
    }
};

var MERGE = function(obj_a, obj_b){
    var temp = $.extend(true, {}, obj_a);
    return $.extend(temp, obj_a, obj_b);
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
    },
    copy: function(input){
        return $.extend(new Vector.zero(), input);
    }
};


var Rect = function(params){
    return MERGE({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }, params);
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
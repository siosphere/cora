/**
 * 
 */

var Camera = Cora.system.create({
    x: 0,
    y: 0,
    z: 1,
    initial_scale: {
        width: 1920,
        height: 1080
    },
    init: function(){
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.__proto__.init();
    },
    start: function(){
        this.camera.position.z = 5;
    },
    get: function(){
        return this.camera;
    },
    shake: function(d, amp){
        
    },
    screenX: function(x){
        return this.scaleX(Camera.x + x);
    },
    screenY: function(y){
        return this.scaleY(Camera.y + y);
    },
    scaleX: function(x){
        var scale = window.innerWidth / Camera.initial_scale.width;
        return x * scale;
    },
    scaleY: function(y){
        var scale = window.innerHeight / Camera.initial_scale.height;
        return y * scale;
    }
});
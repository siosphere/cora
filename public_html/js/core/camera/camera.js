/**
 * 
 */

var Camera = Cora.system.create({
    x: 0,
    y: 0,
    z: 1,
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
        return Camera.x + x;
    },
    screenY: function(y){
        return Camera.y + y;
    }
});
/**
 * 
 */

var Camera = Cora.system.create({
    init: function(){
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.__proto__.init();
    },
    start: function(){
        this.camera.position.z = 5;
    },
    get: function(){
        return this.camera;
    }
});
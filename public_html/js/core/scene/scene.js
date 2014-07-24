/**
 * 
 */


var Scene = Cora.system.create({
    scene: null,
    init: function(){
        this.scene = new THREE.Scene();
        this.__proto__.init();
    },
    get: function(){
        return this.scene;
    }
});
/**
 * 
 */


var Scene = Cora.system.create({
    type: {
        canvas2D: 'SCENE_TYPE_CANVAS2D',
        canvas3D: 'SCENE_TYPE_CANVAS3D'
    },
    layers: [],
    init: function(){
        this.scene = new THREE.Scene();
        this.__proto__.init();
    },
    get: function(){
        return this.scene;
    },
    addLayer: function(layer){
        
        if(typeof(layer.index) === 'undefined'){
            layer.index = 1;
        }
        this.layers.push(layer);
    }
});
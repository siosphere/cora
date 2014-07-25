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
    },
    _sprites: [],
    addSprite: function(sprite){
        this._sprites.push(sprite);
    },
    drawSprites: function(){
        
        /*this._sprites.forEach(function(sprite){
            sprite.draw();
        });*/
    }
});
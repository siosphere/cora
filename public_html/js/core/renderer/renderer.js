/**
 * 
 */


var Renderer = Cora.system.create({
    init: function(){
        this.renderer = new THREE.WebGLRenderer();
        Cora.register(Cora.events.TICK, this.tick);
        this.__proto__.init();
    },
    start: function(){
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    },
    tick: function(){
        Renderer.get().render(Scene.get(), Camera.get());
    },
    get: function(){
        return this.renderer;
    }
});
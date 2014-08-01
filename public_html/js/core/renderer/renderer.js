/**
 * 
 */


var Renderer = Cora.system.create({
    init: function(){
        
        SCRIPT('./core/renderer/texture.js');
        
        this.renderer = new THREE.WebGLRenderer({ alpha: true, canvas: document.getElementById('game_canvas_3d') });
        
        this.surface2D = document.getElementById("game_canvas");
        this.surface2D.width = window.innerWidth;
        this.surface2D.height = window.innerHeight;
        this.surface2DContext = this.surface2D.getContext("2d");
        
        console.log(this.surface2DContext);
        
        /*var imageObj = new Image();
        
        imageObj.onload = function() {
            var pattern = Renderer.surface2DContext.createPattern(imageObj, 'repeat');

            Renderer.get2D().rect(0, 0, Renderer.getCanvas().width, Renderer.getCanvas().height);
            Renderer.get2D().fillStyle = pattern;
            Renderer.get2D().fill();
        };
        imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/wood-pattern.png';*/
        
        Cora.register(Cora.events.TICK, this.tick);
        this.__proto__.init();
    },
    start: function(){
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    },
    tick: function(){
        //clear canvas
        Renderer.get2D().clearRect(0,0,Renderer.getCanvas().width,Renderer.getCanvas().height);
        Renderer.get().render(Scene.get(), Camera.get());
        
        Renderer.get2D().save();
        Renderer.get2D().translate(Camera.x, Camera.y);
        //draw in order of layers
        Scene.layers.sort(function(a, b){
            return a.index - b.index;
        }).forEach(function(layer){
            Entity.draw(layer);
        });
        Renderer.get2D().restore();
        //Entity.draw();
        //Renderer.get2D().fill();
    },
    get: function(){
        return this.renderer;
    },
    get3D: function(){
        return this.renderer;
    },
    get2D: function(){
        return this.surface2DContext;
    },
    getCanvas: function(){
        return this.surface2D;
    }
});
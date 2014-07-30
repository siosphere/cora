/**
 * 
 */


var Background = Entity.create('background', {
    init: function(){
        
        var sourceRect = new Rect({
            x: 0,
            y: 0,
            width: 380,
            height: 271
        });
        
        var texture = new Texture({
            image: Asset.loadImage('media/mainbackground.png'),
            tile: false
        });
        
        this.background = new AnimatedSprite({
            texture: texture,
            sourceRect: sourceRect,
            frameWidth: window.innerWidth,
            frameHeight: window.innerHeight,
            frameCount: 0
        });
        
        var texture1 = new Texture({
            image: Asset.loadImage('media/bgLayer1.png'),
            tile: 'x',
            stretch: true
        });
        
        var texture2 = new Texture({
            image: Asset.loadImage('media/bgLayer2.png'),
            tile: 'x',
            stretch: true
        });
        
        var sourceRect = new Rect({
            x: 0,
            y: 0,
            width: 800,
            height: 480
        });
        
        this.layer1 = new AnimatedSprite({
            texture: texture1,
            sourceRect: sourceRect,
            frameWidth: window.innerWidth,
            frameHeight: window.innerHeight,
            frameCount: 0
        });
        
        this.layer2 = new AnimatedSprite({
            texture: texture2,
            sourceRect: sourceRect,
            frameWidth: window.innerWidth,
            frameHeight: window.innerHeight,
            frameCount: 0
        });
        
        //console.log('background');
    },
    can_tick: true,
    tick: function(){
        this.layer1.position.x -= 1;
        this.layer2.position.x -= 1.5;
        //var position = this.get('position');
        //position.x -= 0.1;
        //this.set('position', position);
    },
    draw: function(){
        this.background.draw();
        this.layer1.draw();
        this.layer2.draw();
    }
});
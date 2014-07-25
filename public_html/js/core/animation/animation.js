/**
 * 
 */


var Animation = Cora.system.create({
    
});

var AnimatedSprite = function(params){
    return MERGE({
        scale: 1.0,
        texture: null,
        frameTime: 0,
        frameCount: 0,
        currentFrame: 0,
        sourceRect: null,
        destRect: null,
        frameWidth: 0,
        frameHeight: 0,
        active: false,
        looping: false,
        position: Vector.zero(),
        init: function(){
            if(this.texture !== null){
                //load this image
                
            }
        },
        draw: function(){
            this.update();
            this.texture.x = this.position.x;
            this.texture.y = this.position.y;
            this.texture.width = this.frameWidth;
            this.texture.height = this.frameHeight;
            this.texture.draw();
        },
        update: function(){
            this.currentFrame++;
            if(this.currentFrame > this.frameCount){
                this.currentFrame = 0;
            }
            if(this.frameCount === 0){
                this.currentFrame = 0;
            }
            this.sourceRect.x = this.currentFrame * this.frameWidth;
            this.texture.sourceWidth = this.sourceRect.width;
            this.texture.sourceHeight = this.sourceRect.height;
            this.texture.sourceX = this.sourceRect.x;
            this.texture.sourceY = this.sourceRect.y;
            
            //this.position.x = this.frameWidth * this.currentFrame;
        }
    }, params);
};
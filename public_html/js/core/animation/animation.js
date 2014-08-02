/**
 * 
 */


var Animation = Cora.system.create({
    
});

var AnimatedSprite = function(params){
    return MERGE({
        shouldDraw: true,
        loop: true,
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
        position: Vector.zero(),
        init: function(){
            if(this.texture !== null){
                //load this image
                
            }
        },
        draw: function(){
            if(!this.shouldDraw){
                return;
            }
            this.update();
            this.texture.x = this.position.x * Camera.z;
            this.texture.y = this.position.y * Camera.z;
            this.texture.width = this.frameWidth * Camera.z;
            this.texture.height = this.frameHeight * Camera.z;
            this.texture.draw();
        },
        update: function(){
            this.currentFrame++;
            if(this.currentFrame > this.frameCount){
                if(this.loop){
                    this.currentFrame = 0;
                } else {
                    this.shouldDraw = false;
                }
            }
            if(this.frameCount === 0){
                this.currentFrame = 0;
            }
            this.sourceRect.x = this.currentFrame * this.sourceRect.width;
            this.texture.sourceWidth = this.sourceRect.width;
            this.texture.sourceHeight = this.sourceRect.height;
            this.texture.sourceX = this.sourceRect.x;
            this.texture.sourceY = this.sourceRect.y;
            
            //this.position.x = this.frameWidth * this.currentFrame;
        }
    }, params);
};
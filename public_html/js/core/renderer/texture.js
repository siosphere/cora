/**
 * 
 */


var Texture = function(params){
    return MERGE({
        tile: false,
        draw: function(){
            
            if(this.image === null){
                return false;
            }
            
            //only if loaded
            if(!this.image.loaded){
                return false;
            }
            if(this.tile !== false){
                var patternType = 'repeat';
                if(this.tile === 'x'){
                    patternType = 'repeat-x';
                }
                if(this.tile === 'y'){
                    patternType = 'repeat-y';
                }
                Renderer.get2D().save();
                //Renderer.get2D().rect(-this.x, -this.y, this.width, this.height);
                this.image.imageAsset.height = this.height + 'px';
                var pattern = Renderer.surface2DContext.createPattern(this.image.imageAsset, patternType);
                Renderer.get2D().fillStyle = pattern;
                Renderer.get2D().translate(this.x, this.y);
                Renderer.get2D().fillRect(-this.x, -this.y, this.width, this.height);
                //Renderer.get2D().fill();
                Renderer.get2D().restore();
            } else {
                Renderer.get2D().drawImage(this.image.imageAsset,this.sourceX,this.sourceY, this.sourceWidth, this.sourceHeight,
                this.x, this.y, this.width, this.height);
            }
            //Renderer.get2D().fill();
        },
        image: null,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: 0,
        sourceHeight: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }, params);
};
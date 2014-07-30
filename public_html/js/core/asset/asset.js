/**
 * our asset manager
 */


var Asset = Cora.system.create({
    images: [],
    meshes: [],
    sounds: [],
    all_loaded: false,
    loadImage: function(path, callback){
        var image = new Asset.image({
            path: path,
            onLoad: callback,
            id: Asset.images.length
        });
        image.load();
        Asset.images.push(image);
        return image;
    },
    loadAudio: function(path, callback){
        var audio = new Asset.audio({
            path: path,
            onLoad: callback,
            id: Asset.sounds.length
        });
        audio.load();
        Asset.sounds.push(audio);
        return audio;
    },
    image: function(params){
        return MERGE({
            loaded: false,
            load: function(){
                this.imageAsset = new Image();
                this.imageAsset.src = this.path;
                var $me = this;
                this.imageAsset.onload = function(){
                    $me.loaded = true;
                    console.log('loaded!');
                    if(typeof( $me.onLoad) === 'function'){
                        $me.onLoad.apply(me);
                    }
                };
            },
            imageAsset: null
        }, params);
    },
    audio: function(params){
        return MERGE({
            loaded: false,
            load: function(){
                this.audioAsset = new Audio(this.path);
                var $me = this;
                this.audioAsset.onload = function(){
                    $me.loaded = true;
                    if(typeof( $me.onLoad) === 'function'){
                        $me.onLoad.apply(me);
                    }
                };
            },
            audioAsset: null,
            play: function(){
                this.audioAsset.play();
            },
            pause: function(){
                this.audioAsset.pause();
            }
        }, params);
    },
    tick: function(){
        var all_loaded = true;
        
        this.images.forEach(function(image){
            if(!image.loaded){
                all_loaded = false;
            }
        });
        
        this.all_loaded = all_loaded;
    }
});
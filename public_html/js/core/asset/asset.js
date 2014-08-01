/**
 * our asset manager
 */


var Asset = Cora.system.create({
    images: [],
    meshes: [],
    sounds: [],
    scripts: [],
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
    loadScript: function(path, callback){
        var script = new Asset.script({
            path: 'js/' + path,
            onLoad: callback,
            id: Asset.scripts.length
        });
        script.load();
        Asset.scripts.push(script);
        return script;
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
    script: function(params){
        return MERGE({
            loaded: false,
            load: function(){
                this.scriptAsset = document.createElement('script');
                this.scriptAsset.src = this.path;
                var $me = this;
                this.scriptAsset.onload = function(){
                    $me.loaded = true;
                    if(typeof( $me.onLoad) === 'function'){
                        $me.onLoad.apply(me);
                    }
                };
                document.head.appendChild(this.scriptAsset);
            },
            scriptAsset: null
        }, params);
    },
    init: function(){
        Cora.register(Cora.events.TICK, this.tick);
    },
    tick: function(){
        if(Asset.all_loaded){
            //remove from tick
            return false;
        }
        var all_loaded = true;
        
        Asset.images.forEach(function(image){
            if(!image.loaded){
                all_loaded = false;
            }
        });
        
        Asset.scripts.forEach(function(script){
            if(!script.loaded){
                all_loaded = false;
            }
        });
        if(all_loaded){
            //send signal that we are all loaded
            Cora.dispatch(Cora.events.ASSET, {
                loaded: true
            });
        }
        Asset.all_loaded = all_loaded;
    }
});
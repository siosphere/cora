/**
 * 
 */



var Cora = new function(){
    return {
        _systems: [],
        _scripts: [],
        _eventDispatchers: [],
        
        /**
         * 
         * @param {type} event_type
         * @param {type} dispatch
         * @returns {undefined}
         */
        register: function(event_type, dispatch){
            if(typeof(this._eventDispatchers[event_type]) === 'undefined'){
                this._eventDispatchers[event_type] = [];
            }
            this._eventDispatchers[event_type].push(dispatch);
        },
        
        /**
         * 
         * @param {type} event_type
         * @param {type} payload
         * @returns {undefined}
         */
        dispatch: function(event_type, payload){
            if(typeof(this._eventDispatchers[event_type]) !== 'undefined'){
                this._eventDispatchers[event_type].forEach(function(dispatcher){
                    dispatcher(payload);
                });
            }
        },
        
        start: function(){
            this._loadSystems(function(){
                this._initSystems();
                this._startSystems();
                this.run();
            });
        },
        
        run: function(){
            requestAnimationFrame(Cora.run);
            Cora.dispatch(Cora.events.TICK, {});
        },
        
        /**
         * 
         * @returns {undefined}
         */
        _loadSystems: function(callback){
            this._loadSystem('core/scene');
            this._loadSystem('core/asset');
            this._loadSystem('core/animation');
            this._loadSystem('core/camera');
            this._loadSystem('core/renderer');
            this._loadSystem('core/entity');
            this._loadSystem('core/input');
            this._loadSystem('core/ui');
            this._loadSystem('core/world');
            this._loadSystem('core/game');
            
            this._loadSystem('game/fallen');
            
            this.checkLoad(callback);
        },
        
        checkLoad: function(callback){
            var finished = true;
            this._scripts.forEach(function(script){
                if(script !== null){
                    finished = false;
                }
            });
            if(!finished){
                setTimeout(function(){
                    Cora.checkLoad(callback);
                }, 100);
            } else {
                callback.apply(this);
            }
        },
        
        _initSystems: function(){
            this._systems.forEach(function(system){
                system.init();
            });
        },
        
        _startSystems: function(){
            this._systems.forEach(function(system){
                system.start();
            });
        },
        
        /**
         * 
         * @param {type} path
         * @returns {undefined}
         */
        _loadSystem: function(path){
            var path_data = path.split('/');
            var main = path_data[path_data.length - 1];
            this._scripts.push(path + '/' + main + '.js');
            var index = this._scripts.length - 1;
            SCRIPT(this._scripts[index], function(){
                Cora._onScriptLoaded(index);
            });
        },
        _onScriptLoaded: function(index){
            if(typeof(this._scripts[index]) !== 'undefined'){
                this._scripts[index] = null;
            }
        },
        system: {
            create: function(params){
                var obj = Object.create(CoraSystem);
                for(var i in params){
                    obj[i] = params[i];
                }
                Cora._systems.push(obj);
                return obj;
            }
        },
        events: {
            ENTITY: 'CORA_EVENT_ENTITY',
            UI:     'CORA_EVENT_UI',
            TICK: 'CORA_EVENT_TICK',
            INPUT: 'CORA_EVENT_INPUT',
            GAME: 'CORA_EVENT_GAME',
            ASSET: 'CORA_EVENT_ASSET'
        }
    };
};


var CoraSystem = {
    init: function(){
        console.log('base cora system init called');
    },
    start: function(){
        
    },
    tick: function(){
        
    }
};
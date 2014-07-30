/**
 * 
 */


var Entity = Cora.system.create({
    actions: {
        CREATE: 'ENTITY_CREATE',
        UPDATE: 'ENTITY_UPDATE'
    },
    type: {
        NPC: 'ENTITY_TYPE_NPC',
        OTHER: 'ENTITY_TYPE_OTHER'
    },
    init: function(){
        Cora.register(Cora.events.ENTITY, this.receive);
        Cora.register(Cora.events.TICK, this.tick);
    },
    tick: function(){
        if(Game.current_state !== Game.state.BEGIN && Game.current_state !== Game.state.RESUME){
            return;
        }
        Entity.entities.forEach(function(entity){
            if(entity !== false){
                if(entity.needs_update){
                    entity.sync();
                }
                if(entity.can_tick){
                    entity.tick();
                }
            }
        });
        
        //entity collide
        var collision = Entity.entities.filter(function(entity){
            return entity.collide;
        });
        
        var collided = [];
        
        collision.forEach(function(a){
            collision.forEach(function(b){
                if(a.id === b.id){
                    return;
                }
                
                var tl, tr, bl, br;
                tl = {
                    x: a.position.x,
                    y: a.position.y
                };
                tr = {
                    x: a.position.x + a.width,
                    y: a.position.y
                };
                bl = {
                    x: a.position.x,
                    y: a.position.y + a.height
                };
                
                br = {
                    x: a.position.x + a.width,
                    y: a.position.y + a.height
                };
                
                if((tl.x >= b.position.x && tl.x <= b.position.x + b.width
                        && tl.y >= b.position.y && tl.y <= b.position.y + b.height)
                        || (tr.x >= b.position.x && tr.x <= b.position.x + b.width
                        && tr.y >= b.position.y && tr.y <= b.position.y + b.height)
                        || (bl.x >= b.position.x && bl.x <= b.position.x + b.width
                        && bl.y >= b.position.y && bl.y <= b.position.y + b.height)
                        || (br.x >= b.position.x && br.x <= b.position.x + b.width
                        && br.y >= b.position.y && br.y <= b.position.y + b.height)){
                    //console.log(a.position.x, b.position.x);
                    a.onCollide(b);
                }
            });
        });
        
    },
    draw: function(){
        Entity.entities.forEach(function(entity){
            if(entity !== false && entity.visible){
                entity.draw();
            }
        });
    },
    start: function(){
        
    },
    
    entities: [],
    available_entities: {},
    
    /**
     * Dispatch an entity action
     * @param {type} action
     * @param {type} payload
     * @returns {undefined}
     */
    dispatch: function(action, payload){
        Cora.dispatch(Cora.events.ENTITY, {
            action: action,
            payload: payload
        });
    },
    
    receive: function(payload){
        if(typeof(payload.action) === 'undefined'){
            return false;
        }
        
        switch(payload.action){
            case Entity.actions.CREATE:
                Entity._createEntity(payload.payload);
                break;
            case Entity.actions.UPDATE:
                Entity._updateEntity(payload.payload);
            break;
        }
    },
    /**
     * Place entity in the world
     * @param {type} entity
     * @returns {undefined}
     */
    place: function(entity){
        if(entity.loaded){
            return;
        }
        entity.loaded = true;
        entity.id = this.entities.length;
        this.entities.push(entity);
        entity.init(); //init once we have an id
        entity.sync();
        if(entity.getMesh()){
            Scene.get().add( entity.getMesh() );
        } else {
            //add to 2d canvas
            //Scene.addSprite( entity.getSprite() );
        }
    },
    
    /**
     * 
     */
    remove: function(entity_id){
        
        var entity_index = Entity.getEntityIndex(entity_id);
        if(entity_index === false){
            return false;
        }
        var entity = Entity.entities[entity_index];
        entity.remove();
        Entity.entities[entity_index] = false;
        //Entity.entities.splice(entity_index, 1);
    },
    
    getEntityIndex: function(entity_id){
        var index = false;
        Entity.entities.forEach(function(_entity, i){
            if(_entity.id === entity_id){
                index = i;
            }
        });

        return index;
    },
    
    _createEntity: function(params){
        var entity = Object.create(new EntityModel());
        entity = MERGE(entity, params);
        return entity;
        //this.place(entity);
    },
    
    createByName: function(name, params){
        if(typeof(Entity.available_entities[name]) !== 'undefined'){
            var entity = new Entity.available_entities[name](params); //MERGE(new Entity.available_entities[name](), params);
            return entity;
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    create: function(name, params){
        var entity = new EntityModel();
        entity = MERGE(entity, params);
        this.available_entities[name] = function(params){
            return MERGE(entity, params);
        };
    },
    
    
    _updateEntity: function(payload){
        var index = null;
        Entity.entities.forEach(function(_entity, i){
            if(_entity.id === payload.entity_id){
                index = i;
            }
        });
        
        if(index === null){
            return false;
        }
        
        for(var i in payload.update){
            Entity.entities[index].set(i, payload.update[i]);
        }
        
        
        
        //this.entities[index] = entity;
        
        //this.place(entity);
    },
    getEntity: function(entity_id){
        var entity = false;
        this.entities.forEach(function(_entity){
            if(_entity.id === entity_id){
                entity = _entity;
            }
        });
        return entity;
    },
    filterType: function(type){
        return function(entity){
            if(entity.type !== type){
                return false;
            }
            return true;
        };
    }
});


var EntityModel = function(){
    return {
        visible: true,
        needs_update: false,
        can_tick: false,
        tick: function(){

        },
        id: null,
        mesh: null,
        position: new Vector.zero(),
        sync: function(){
            //sync position of the node, with position of the mesh
            var mesh = this.getMesh();
            if(typeof(mesh) !== 'undefined' && mesh !== null){
                mesh.position.x = this.position.x;
                mesh.position.y = this.position.y;
                mesh.position.z = this.position.z;
            }
            var sprite = this.getSprite();
            if(typeof(sprite) !== 'undefined' && sprite !== null){
                sprite.position.x = this.position.x;
                sprite.position.y = this.position.y; //backwards for canvas2D
                sprite.position.z = 0;
            }
            this.needs_update = false;
        },
        getMesh: function(){
            if(typeof(this.mesh) === 'function'){
                return this.mesh();
            }
            return this.mesh;
        },
        getSprite: function(){
            if(typeof(this.sprite) === 'function'){
                return this.sprite();
            }
            return this.sprite;
        },
        loaded: false,
        location: new Vector.zero(),
        get: function(i){
            return this[i];
        },
        set: function(i, value){
            this[i] = value;
            this.needs_update = true;
            return this;
        },
        init: function(){

        },
        draw: function(){
            var sprite = this.getSprite();
            if(sprite !== false){
                sprite.draw();
            }
        },
        onCollide: function(target){

        },
        collide: false,
        remove: function(){
            
        }
    };
};
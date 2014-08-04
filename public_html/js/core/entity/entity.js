/**
 * 
 */


var Entity = Cora.system.create({
    actions: {
        CREATE: 'ENTITY_CREATE',
        UPDATE: 'ENTITY_UPDATE',
        SPAWN: 'ENTITY_SPAWN',
        NETWORK_UPDATE: 'ENTITY_NETWORK_UPDATE'
    },
    type: {
        NPC: 'ENTITY_TYPE_NPC',
        MODEL: 'ENTITY_TYPE_MODEL',
        OTHER: 'ENTITY_TYPE_OTHER'
    },
    init: function(){
        Cora.register(Cora.events.ENTITY, this.receive);
        Cora.register(Cora.events.TICK, this.tick);
        Cora.register(Cora.events.ASSET, this.assets_loaded);
    },
    last_network_update: null,
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
                /*if(entity.networkable && Entity.last_network_update !== null){
                    //update entity with latest from network
                    Entity.entities.filter(function(entity){
                        return entity.networkable;
                    }).forEach(function(_entity, index){
                        Entity.last_network_update.entities.forEach(function(network_entity){
                            if(_entity.network_id === network_entity.network_id){
                                for(var i in network_entity.params){
                                    //lerp
                                    //_entity[i] = LERP(network_entity.params[i], _entity[i]);
                                    _entity[i] = LERP(_entity[i], network_entity.params[i]);
                                    //_entity[i] = network_entity.params[i];
                                }
                            }
                        });
                    });
                    Entity.last_network_update = null;
                }*/
                //entity.needs_update = false;
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
                
                if(a.layer_id !== b.layer_id){
                    return;
                }
                if(a.collision_types.indexOf(b.type) === -1){
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
    draw: function(layer){
        Entity.entities.filter(function(entity){
            if(entity.layer_id === layer.id){
                return true;
            }
            return false;
        }).forEach(function(entity){
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
            case Entity.actions.SPAWN:
                var my_entity = Entity.createByName(payload.payload.entity_name, payload.payload.entity_params);
                console.log('NETWORK SPAWN', payload.payload.entity_name, payload.payload.entity_params.position.x, my_entity.position.x);
                Entity.place(my_entity, payload.payload.layer_id);
                break;
            case Entity.actions.UPDATE:
                Entity._updateEntity(payload.payload);
            break;
            case Entity.actions.NETWORK_UPDATE:
                Entity._networkUpdate(payload.payload);
            break;
        }
    },
    /**
     * Place entity in the world
     * @param {type} entity
     * @returns {undefined}
     */
    place: function(entity, layer_id){
        if(entity.loaded){
            return;
        }
        
        console.log('about to spawn:', entity.position.x);
        
        entity.loaded = true;
        entity.id = this.entities.length;
        entity.layer_id = layer_id;
        this.entities.push(entity);
        entity.spawn(); //spawn
        
        if(entity.networkable && Network.is_host){
            Network.entity(entity);
        }
        
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
            //entity.init();
            return entity;
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    create: function(name, params){
        var entity = new EntityModel();
        /*if(typeof(params.base) !== 'undefined'){
            entity = MERGE(entity, entity.base);
        }*/
        params.name = name;
        entity = MERGE(entity, params);
        return this.available_entities[name] = function(params){
            entity.init();
            return MERGE(entity, params);
        };
    },
    assets_loaded: function(payload){
        if(payload.loaded === true){
            for(var i in Entity.available_entities){
                var entity = new Entity.available_entities[i]();
                if(typeof(entity.base) !== 'undefined'){
                    Entity.available_entities[i] = function(params){
                        return MERGE(Entity.createByName(entity.base, entity), params);
                    };
                }
            }
        }
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
        var changed = false;
        for(var i in payload.update){
            if(!EQUAL(Entity.entities[index][i], payload.update[i])){
                Entity.entities[index][i] =  payload.update[i];
                Entity.entities[index].needs_update = true;
            }
        }
        //this.entities[index] = entity;
        
        //this.place(entity);
    },
    _networkUpdate: function(payload){
        if(payload.client_id !== Network.client_id){
            //Entity.last_network_update = payload;
            payload.entities.forEach(function(update_entity){
                
                Entity.entities.forEach(function(entity){
                    if(entity.network_id === update_entity.network_id){
                        var recv_variables = Network.network_recv_tables[entity.name];
                        recv_variables.forEach(function(recv_var){
                            recv_var.callback(entity, update_entity.params[recv_var.name]);
                        });
                    }
                });
            });
            
            
        }
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
        networkable: false,
        type: Entity.type.MODEL,
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
            //this.needs_update = false;
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
            
            var same = this[i] === value;
            if(typeof(this[i]) === 'object'){
                same = JSON.stringify(this[i]) === JSON.stringify(value);
            }
            
            if(!same){
                this[i] = value;
                this.needs_update = true;
            }
            return this;
        },
        init: function(){

        },
        spawn: function(){
            
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
        collision_types: [Entity.type.MODEL],
        remove: function(){
            
        }
    };
};
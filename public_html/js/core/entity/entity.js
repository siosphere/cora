/**
 * 
 */


var Entity = Cora.system.create({
    actions: {
        CREATE: 'ENTITY_CREATE',
        UPDATE: 'ENTITY_UPDATE'
    },
    init: function(){
        Cora.register(Cora.events.ENTITY, this.receive);
        Cora.register(Cora.events.TICK, this.tick);
    },
    tick: function(){
        Entity.entities.forEach(function(entity){
            if(entity.needs_update){
                entity.sync();
            }
            if(entity.can_tick){
                entity.tick();
            }
        });
    },
    draw: function(){
        Entity.entities.forEach(function(entity){
            if(entity.visible){
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
        entity.init(); //init once we have an id
        entity.sync();
        this.entities.push(entity);
        if(entity.getMesh()){
            Scene.get().add( entity.getMesh() );
        } else {
            //add to 2d canvas
            Scene.addSprite( entity.getSprite() );
        }
    },
    
    _createEntity: function(params){
        var entity = Object.create(EntityModel);
        entity = MERGE(entity, params);
        return entity;
        //this.place(entity);
    },
    
    createByName: function(name, params){
        if(typeof(Entity.available_entities[name]) !== 'undefined'){
            var entity = MERGE(Entity.available_entities[name], params);
            return entity;
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    create: function(name, params){
        var entity = Object.create(EntityModel);
        entity = MERGE(entity, params);
        this.available_entities[name] = entity;
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
    }
});


var EntityModel = {
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
    }
};
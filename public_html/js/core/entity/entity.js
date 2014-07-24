/**
 * 
 */


var Entity = Cora.system.create({
    actions: {
        CREATE: 'ENTITY_CREATE'
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
        entity.sync();
        this.entities.push(entity);
        Scene.get().add( entity.getMesh() );
        console.log('added to scene');
    },
    
    _createEntity: function(params){
        var entity = Object.create(EntityModel);
        entity = MERGE(entity, params);
        entity.init();
        return entity;
        //this.place(entity);
    },
    
    createByName: function(name, params){
        if(typeof(Entity.available_entities[name]) !== 'undefined'){
            var entity = MERGE(Entity.available_entities[name], params);
            entity.init();
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
    }
});


var EntityModel = {
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
        this.needs_update = false;
    },
    getMesh: function(){
        if(typeof(this.mesh) === 'function'){
            return this.mesh();
        }
        return this.mesh;
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
        
    }
};
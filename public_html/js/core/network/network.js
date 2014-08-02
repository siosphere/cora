/**
 * 
 */


var Network = Cora.system.create({
    clients: [],
    conn: null,
    connected: false,
    is_host: false,
    update_time: 0.01, //in ms
    last_update: null,
    type: {
        CREATE: 'NETWORK_TYPE_CREATE',
        UPDATE: 'NETWORK_TYPE_UPDATE',
        DESTROY: 'NETWORK_TYPE_DESTROY',
        CONNECT: 'NETWORK_TYPE_CONNECT',
        DISCONNECT: 'NETWORK_TYPE_DISCONNECT'
    },
    init: function(){
        Cora.register(Cora.events.GAME, this.gameEvent);
        Cora.register(Cora.events.TICK, this.tick);
        //Cora.register(Cora.events.ENTITY, this.entityEvent);
        Cora.register(Cora.events.NETWORK, this.networkEvent);
    },
    onStart: function(){
        this.conn = new WebSocket('ws://50.148.174.193:8080');
        this.conn.onopen = this.onConnect;
        this.conn.onmessage = this.onMessage;
    },
    gameEvent: function(event){
        switch(event.action){
            case Game.actions.STATE_CHANGED:
                var new_state = event.payload.state;
                switch(new_state){
                    case Game.state.BEGIN:
                        Network.onStart();
                        break;
                }
                break;
        }
    },
    entityEvent: function(event){
        switch(event.action){
            case Entity.actions.UPDATE:
                Network._updateEntity(event.payload);
            break;
        }
    },
    networkEvent: function(event){
        switch(event.type){
            case Network.type.CONNECT:
                Network.clients.push(event.client_id);
                //create a player
                
                var new_player = Entity.createByName('player', {
                    client_id: event.client_id
                });
                //console.log(new_player, Fallen.getPlayer().layer_id);
                
                Entity.place(new_player, Fallen.getPlayer().layer_id); //as my player
                //inform everyone of this new player
                
                //console.log('New client connected');
                //we need to sync all of our entities
                Network.syncEntities(event.client_id);
                break;
        }
    },
    syncEntities: function(client_id){
        //console.log('syncing entities',  Network.entities);
        //send specific client message
        Entity.entities.filter(function(entity){
            return entity.networkable;
        }).forEach(function(entity){
            //params would be our current watched variables
            var params = {};
            
            if(typeof(Network.network_tables[entity.name]) !== 'undefined'){
                Network.network_tables[entity.name].forEach(function(v){
                    params[v] = entity[v];
                });
            }
            Network.dispatch(client_id, Cora.events.ENTITY, {
                action: Entity.actions.SPAWN,
                payload: {
                    entity_name: entity.name,
                    network_id: entity.network_id,
                    entity_params: params,
                    layer_id: entity.layer_id
                }
            });
        });
    },
    /**
     * add this entity to our networkable list, as it has spawned,
     * give it a network id
     * @param {type} entity
     * @returns {undefined}
     */
    entity: function(entity){
        entity.network_id = GUID();
    },
    _updateEntity: function(payload){
        //if this entity is networkable
        if(typeof(Network.for_update[payload.entity_id]) !== 'undefined'){
            //send this update across
            Network.queueData({
                entity_id: payload.entity_id,
                update: payload.update
            });
        }
    },
    queueData: function(data){
        if(typeof(Network.next_send.entities) === 'undefined'){
            Network.next_send.entities = [];
        }
        
        Network.next_send.entities.push(data);
    },
    tick: function(){
        //look for updates in our entities
        //
        
        if(Network.last_update !== null && Game.clock.getElapsedTime() - Network.update_time < Network.last_update){
            return; //update every 10 ms
        }
        console.log('update');
        Network.last_update = Game.clock.getElapsedTime();
        
        var update = false;
        var payload = {
            entities: []
        };
        Entity.entities.filter(function(entity){
            return entity.networkable && entity.needs_update;
        }).forEach(function(entity){
            var params = {};
            if(typeof(Network.network_tables[entity.name]) !== 'undefined'){
                Network.network_tables[entity.name].forEach(function(v){
                    params[v] = entity[v];
                });
            }
            payload.entities.push({
                network_id: entity.network_id,
                params: params
            });
            
            update = true;
        });
        
        if(update){
            Network.dispatch('all', Cora.events.ENTITY, {
                action: Entity.actions.NETWORK_UPDATE,
                payload: payload
            });
        }
        
        //if(Network.connected && typeof(Network.next_send.entities) !== 'undefined' && Network.next_send.entities.length > 0){
            /*Network.sendPayload(Network.next_send);
            Network.next_send.entities = [];*/
        //}
    },
    onMessage: function(e){
        var event = JSON.parse(e.data);
        if(event !== false){
            
            switch(event.client){
                case 'host':
                    if(Network.is_host){
                        Cora.dispatch(event.type, event.payload);
                    }
                    break;
                case 'all':
                    Cora.dispatch(event.type, event.payload);
                    break;
                default:
                    //for specific client TODO
                    if(event.client === Network.client_id){
                        Cora.dispatch(event.type, event.payload);
                    }
                    break;
            }
        }
    },
    dispatch: function(client, type, payload){
        var event = {
            client_id: Network.client_id,
            client: client, //audience
            type: type,
            payload: payload
        };
        if(Network.connected === true){
            Network.conn.send(JSON.stringify(event));
        }
    },
    onConnect: function(e){
        Network.connected = true;
        Network.client_id = GUID();
        Fallen.getPlayer().client_id = Network.client_id;
        //send payload that we are a new client
        if(!Network.is_host){
            Network.dispatch('all', Cora.events.NETWORK, {
                type: Network.type.CONNECT,
                client_id: Network.client_id
            });
        }
    },
    network_tables: {},
    current_network_table: null,
    start_table: function(entity_name){
        Network.network_tables[entity_name] = [];
        Network.current_network_table = entity_name;
        Network.variable('network_id');
    },
    variable: function(name){
        Network.network_tables[Network.current_network_table].push(name);
    },
    end_table: function(){
        Network.current_network_table = null;
    }
});
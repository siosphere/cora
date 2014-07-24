/**
 * 
 */


var TestEntity = Entity.create('test_entity', {
    init: function(){
        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        this.mesh = cube;
    },
    can_tick: true,
    tick: function(){
        //var position = this.get('position');
        //position.x -= 0.1;
        //this.set('position', position);
    }
});
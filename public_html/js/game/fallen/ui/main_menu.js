/**
 * @jsx React.DOM
 */


var MainMenu = React.createClass({
    render: function(){
        if(!this.props.visible){
            return null;
        }
        
        var menu = [];
        if(Game.running){
            menu.push((<li onClick={this.click}>Resume Game</li>));
        } else {
            menu.push((<li onClick={this.click}>Create Game</li>));
            menu.push((<li onClick={this.join}>Join Game</li>));
        }
        
        return (<div className="main-menu"><ul>
                {menu}
        </ul></div>);
    },
    join: function(){
        //show join panel
        //hide the menu, start the game
        
        if(Game.running){
            var state = Game.state.RESUME;
        } else {
            var state = Game.state.BEGIN;
        }
        
        //change the game state
        Game.dispatch(Game.actions.STATE_CHANGE, {
            state: state
        });
    },
    click: function(){
        //hide the menu, start the game
        Network.is_host = true;
        if(Game.running){
            var state = Game.state.RESUME;
        } else {
            var state = Game.state.BEGIN;
        }
        
        //change the game state
        Game.dispatch(Game.actions.STATE_CHANGE, {
            state: state
        });
        
        /*UI.dispatch(UI.actions.UPDATE_PANEL, {
            panel_id: this.props.id,
            update: {
                visible: false
            }
        });
        Game.begin();*/
    }
});
/**
 * @jsx React.DOM
 */


var MainMenu = React.createClass({
    render: function(){
        if(!this.props.visible){
            return null;
        }
        return (<div><ul>
                <li onClick={this.click}>Start Game</li>
        </ul></div>);
    },
    click: function(){
        //hide the menu, start the game
        UI.dispatch(UI.actions.UPDATE_PANEL, {
            panel_id: this.props.id,
            update: {
                visible: false
            }
        });
        Game.begin();
    }
});
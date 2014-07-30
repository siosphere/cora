/**
 * @jsx React.DOM
 */


var UserHud = React.createClass({
    render: function(){
        if(!this.props.visible){
            return null;
        }
        
        var health_class = 'full';
        if(this.props.health <= 25){
            health_class = 'danger';
        }
        
        return (<div className="hud">
            Health: <span className={health_class}>{this.props.health}</span>
        </div>);
    }
});
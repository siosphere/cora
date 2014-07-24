/**
 * @jsx React.DOM
 */

var Viewport = React.createClass({
    getInitialState: function(){
        return {
            panels: []
        };
    },
    componentWillMount: function(){
        Cora.register(Cora.events.UI, this.ui_event);
    },
    render: function(){
        var panels = this.state.panels.map(function(panel){
            return panel.view(panel);
        });
        
        return (<div>{panels}</div>);
    },
    ui_event: function(payload){
        switch(payload.action){
            case UI.actions.NEW_PANEL:
            case UI.actions.UPDATE:
                console.log('updating');
                this.setState({
                    panels: UI.panels
                });
                break;
        }
    }
});
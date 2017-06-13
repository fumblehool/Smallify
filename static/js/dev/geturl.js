var App = React.createClass({
    getInitialState: function(){
        return { searchQuery: [],
                 searchResult: [] };
    },
    doSearch: function(){
        var query=this.refs.searchInput.value;
        var url = this.props.url + query;
        var self = this;
        axios.get(url)
        .then(function(response){
            self.setState({
                searchResult: response.data.username
            })
        
            console.log("axios get request successful!");
            console.log(response);
        })
        .catch(function(error){
            self.setState({
                searchResult: " "
            })
        });
    },

    render: function(){
        return(
            <div>
            <form>
                <input type="text" id="shorturlenter" placeholder="Search ShortUrl" 
                onChange={this.doSearch}
                ref="searchInput"/>
            </form>
            <div>
                <h1> Hello!
                {this.state.searchResult}
                </h1>
            </div>
            </div>
            );
    }
});



ReactDOM.render(
    <App url="/api/"/>,
    document.getElementById('main')
);

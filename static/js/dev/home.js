var Header = React.createClass({
    render: function(){
        return(<header className="navbar navbar-inverse navbar-fixed-top bs-docs-nav" role="banner">           
                    <div className="container">
                        <div className="navbar-header">
                            <button className="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a href="#" className="navbar-brand">Smallify</a>   
                        </div>
                        <nav className="collapse navbar-collapse bs-navbar-collapse" role="navigation">
                            <ul className="nav navbar-nav">
                                <li><a href="/view_records/">View Record</a></li>
                                <li><a href="/logout">Logout</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>)
    }
});

var Form = React.createClass({
    handleSubmit: function(event){
        var url = this.refs.sourceurl.value; // this is the source url value
        var message = this.refs.message.value; // message value

        if(url.length === 0 || message.length ===0){
            alert("Url and Message cannot be empty.");
            event.preventDefault();
        }
        else{
            event.preventDefault();
        this.props.onSubmit(url, message);
        }
    },
    render: function(){
        return(
            <div>
                <div className="text-center">
                    <form onSubmit={this.handleSubmit}>
                    <div>
                        <input type="text" name="url" placeholder="Source Url"
                         ref="sourceurl"/>
                    </div>
                    <div>
                        <textarea placeholder="Message" name="message" 
                         ref="message"></textarea>
                    </div>
                    <div>
                        <button className="btn btn-large btn-success" >
                            Submit
                        </button>
                    </div>  
                    </form>
                </div>
                
            </div>
        )
    }
});



var ShowShortUrl = React.createClass({
    componentDidmount: function(){

    },
    render: function(){
        var data = this.props.shorturl;
        var link = "http://localhost:7777/" + data;
        if(data.length != 0){
        return(
            <h1> URL: <a target="_blank" href={link}>{link}</a></h1>
        )}
        return(
            <div></div>
        )
    }
});


var Main = React.createClass({
    getInitialState: function(){
        return{
            shorturl: []
        }
    },
    postToServer: function(url, message){
        var self = this;
        axios.post(this.props.url,{
            url: url,
            message: message
        })
        .then(function(response){
            self.setState({
                shorturl: response.data.shorturl
            })
            console.log("request successful");
        })
        .catch(function(response){
            console.log("error");
        });
    },
    render: function(){
        return(
            <div className="container">
                <div className="col-md-3"></div>
                <div className="col-md-6 text-center">
                    <h1>Smallify</h1>
                    <Form onSubmit={this.postToServer}
                     shorturl={this.state.shorturl}/>
                    <div>
                        <ShowShortUrl shorturl={this.state.shorturl}/>
                    </div>
                    
                </div>
                <div className="col-md-3"></div>
            </div>
        )
    }
});

var App = React.createClass({
    render: function(){
        return(
            <div>
            <Header/>
            <Main url="/api/"/>
            </div>
        );
    }
});

ReactDOM.render(
    <App url="/api/"/>,
    document.getElementById("App")
)
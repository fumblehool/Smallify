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
                            </ul>
                        </nav>
                    </div>
                </header>)
    }
});

var Body = React.createClass({
    render: function(){
        var style = {width: '70%'};
        return(<center>
                <div className="jumbotron" style={style}>
                    <h1>Smallify App</h1>
                    <p className="lead"></p>
                    <p><a className="btn btn-lg btn-success" href="/login" role="button">Get Started!</a>
                    </p>
                </div>
                </center>)
    }
});


var Footer = React.createClass({
    render: function(){
        return(<footer>
                <div className="container">
                    <hr />
                    <p className="text-center">Copyright &copy; Smallify 2017. All rights reserved.</p>
                </div>
            </footer>)
    }
})
    

var App = React.createClass({
    render: function(){
        return(<div>
                <Header/>
                <Body/>
                <Footer/>
                </div>)
    }
});

ReactDOM.render(
    <App {...(root.dataset)}/>,
    document.getElementById("root")
)
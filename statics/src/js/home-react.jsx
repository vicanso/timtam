var CommentBox = React.createClass({
  render: function () {
    return ( < div className = "commentBox" >
      Hello, world!I am a CommentBox. < /div>
    );
  }
});
ReactDOM.render( < CommentBox / > ,
  document.getElementById('content')
);

request.get('/log/count/test').then(function(res){
	console.dir(res.body);
}, function(err){

});
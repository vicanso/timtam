
var http = require('component/http');

var Log = React.createClass({
  render: function() {
    return (
      <div className="log">
        {this.props.message}
      </div>
    );
  }
});

// var Comment = React.createClass({
//   rawMarkup: function() {
//     var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
//     return { __html: rawMarkup };
//   },

//   render: function() {
//     return (
//       <div className="comment">
//         <h2 className="commentAuthor">
//           {this.props.author}
//         </h2>
//         <span dangerouslySetInnerHTML={this.rawMarkup()} />
//       </div>
//     );
//   }
// });



var LogList = React.createClass({
  render: function() {
    var logNodes = this.props.data.mao(function(log) {
      return (
        <Log message={log.message} />
      );
    });
    return (
      <div className="logList">
        {logNodes}
      </div>
    );
  }
});

// var CommentList = React.createClass({
//   render: function() {
//     var commentNodes = this.props.data.map(function(comment) {
//       return (
//         <Comment author={comment.author} key={comment.id}>
//           {comment.text}
//         </Comment>
//       );
//     });
//     return (
//       <div className="commentList">
//         {commentNodes}
//       </div>
//     );
//   }
// });



var LogBox = React.createClass({
  getInitialState: function() {
    return {
      data: null
    };
  },
  componentDidMount: function() {
    http.get('/log/filter/test').then(function(res) {
      console.dir(res);
    }.bind(this), function(err) {

    }.bind(this));
  },
  render: function() {
    return (
      <div className="logBox">
      </div>
    );
  }
});




exports.render = function(id){
  ReactDOM.render(
    <LogBox />,
    document.getElementById(id)
  );
};



// // tutorial13.js
// var CommentBox = React.createClass({
//   getInitialState: function() {
//     return {data: []};
//   },
//   componentDidMount: function() {
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       cache: false,
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   render: function() {
//     return (
//       <div className="commentBox">
//         <h1>Comments</h1>
//         <CommentList data={this.state.data} />
//         <CommentForm />
//       </div>
//     );
//   }
// });
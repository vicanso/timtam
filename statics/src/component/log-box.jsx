
var rest = require('component/rest');
var classNames = require('component/classnames');

var Log = React.createClass({
	render: function() {
		var options = this.props.options;
		var log = this.props.log;
		var obj = {
			level: true
		};
		obj[log.level] = true;
		var tagClass = classNames(obj); 
		var timeHtml = '';
		var timeClass = classNames({
			time: true
		});
		if (options.time) {
			timeHtml = <span className={timeClass}>{log.time}</span>
		}
		return (
			<p className="log">
				{timeHtml}
				<span className={tagClass}>[{log.level}]</span>
				{log.message}
			</p>
		);
	}
});


var LogList = React.createClass({
	render: function() {
		var arr = this.props.data;
		var options = this.props.options;
		var logNodes = '正在加载，请稍候...';

		if (arr) {		
			var dateClass = classNames({
				date: true
			});
			var currentDate = '';
			logNodes = arr.map(function(log, index) {
				var dateHtml = '';
				if (log.date !== currentDate) {
					dateHtml = <div className={dateClass}>{log.date}</div>;
					currentDate = log.date;
				}
				return (
					<div key={index}>
						{dateHtml}
						<Log log={log} options={options} />
					</div>
				);
			});
		}
		return (
			<div className="logList">
				{logNodes}
			</div>
		);
	}
});


var LogBox = React.createClass({
	getInitialState: function() {
		return {
			data: null,
			options: {
				// 是否显示日志时间
				time: true
			}
		};
	},
	componentDidMount: function() {
		rest.logs('test').then(function(res) {
			this.setState({data: res});
		}.bind(this), function(err) {

		}.bind(this));
	},
	render: function() {
		return (
			<div className="logBox">
				<h1>Logs</h1>
				<LogList data={this.state.data} options={this.state.options} />
			</div>
		);
	}
});




exports.render = function(id){
	return ReactDOM.render(
		<LogBox />,
		document.getElementById(id)
	);
};

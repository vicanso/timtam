
var rest = require('component/rest');
var classNames = require('component/classnames');
var util = require('component/util');

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


var LogFilterForm = React.createClass({
	getInitialState: function() {
		var arr = util.formatDate(new Date()).split(' ');
		return {
			apps: null,
			begin: {
				date: arr[0],
				time: '00:00'
			},
			end: {
				date: arr[0],
				time: arr[1].substring(0, 5)
			}
		};
	},
	componentDidMount: function() {
		rest.listApp().then(function(apps){
			this.setState({app: apps[0]});
			this.setState({apps: apps});
		}.bind(this), function(err){
			// TODO
			console.error(err);
		});
	},
	handleAppSelect: function(e) {
		this.setState({app: e.target.value});
	},
	handleDateChange: function(e) {
		var v = e.target.value;
		var key = e.target.dataset.key;
		var arr = key.split('-');
		var data = {};
		var tmp = {};
		tmp[arr[1]] = v;
		data[arr[0]] = tmp;
		this.setState(data);
		console.dir(this.state);
	},
	handleSumit: function(e){
		e.preventDefault();
		var state = this.state;
		var data = {
			app: state.app,
			begin : state.begin.date + ' ' + state.begin.time
		};

		this.props.onFilterSummit(data);
	},
	render: function() {
		var optionsHtml = '';
		var state = this.state;
		var apps = state.apps;
		if (apps) {
			optionsHtml = apps.map(function(app) {
				return <option key={app}>{app}</option>;
			});
		}
		return (
			<form className="pure-form logFilter" onSubmit={this.handleSumit}>
				<fieldset>
					<legend>filter for log</legend>
					<select onChange={this.handleAppSelect}>
						{optionsHtml}
					</select>
					<input type="date" placeholder="log begin date" onChange={this.handleDateChange} value={state.begin.date} data-key="begin-date" />
					<input type="time" placeholder="log begin time" onChange={this.handleDateChange} value={state.begin.time} data-key="begin-time" />
					<span className="divide"></span>
					<input type="date" placeholder="log end date" onChange={this.handleDateChange} value={state.end.date} data-key="end-date" />
					<input type="time" placeholder="log end time" onChange={this.handleDateChange} value={state.end.time} data-key="end-time" />
					<button type="submit" className="pure-button pure-button-primary">Submit</button>
				</fieldset>
			</form>
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
	handleFilterSubmit: function(data) {
		console.dir(data);
		this.setState({data: null});
		rest.logs(data.app).then(function(res) {
			this.setState({data: res});
		}.bind(this), function(err) {

		}.bind(this));
	},
	componentDidMount: function() {
		// rest.logs('test').then(function(res) {
		// 	this.setState({data: res});
		// }.bind(this), function(err) {

		// }.bind(this));
	},
	render: function() {
		return (
			<div className="logBox">
				<h1>Logs</h1>
				<LogFilterForm onFilterSummit={this.handleFilterSubmit} />
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

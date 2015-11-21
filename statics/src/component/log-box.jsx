
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
			beginDate: arr[0],
			beginTime: '00:00',
			endDate: arr[0],
			endTime: arr[1]
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
		var data = {};
		data[e.target.dataset.key] = e.target.value;
		this.setState(data);
	},
	handleSumit: function(e){
		e.preventDefault();
		var state = this.state;
		var begin = state.beginDate + ' ' + state.beginTime;
		var end = state.endDate + ' ' + state.endTime;
		var data = {
			app: state.app,
			begin: (new Date(begin)).toISOString(),
			end: (new Date(end)).toISOString()
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
					<i className="fa fa-filter"></i>
					<select onChange={this.handleAppSelect}>
						{optionsHtml}
					</select>
					<input type="date" placeholder="log begin date" onChange={this.handleDateChange} value={state.beginDate} data-key="beginDate" />
					<input type="time" placeholder="log begin time" onChange={this.handleDateChange} value={state.beginTime} data-key="beginTime" />
					<span className="divide">-</span>
					<input type="date" placeholder="log end date" onChange={this.handleDateChange} value={state.endDate} data-key="endDate" />
					<input type="time" placeholder="log end time" onChange={this.handleDateChange} value={state.endTime} data-key="endTime" />
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
		var app = data.app;
		delete data.app;
		this.setState({data: null});
		rest.logs(app, data).then(function(res) {
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

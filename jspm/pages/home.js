'use strict';
import * as log from '../components/log';
import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import _ from 'lodash';
import Emitter from 'component-emitter';
import moment from 'moment';

const emitter = new Emitter();


class LogContentList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subTags : []
		};
		this.onSelectTags = (tags) => {
			this.setState({
				subTags : tags
			});
		}.bind(this)
	}
	componentDidMount() {
		emitter.on('selectTags', this.onSelectTags);
	}
	componentWillUnmount() {
		emitter.off('selectedTags', this.onSelectTags);
	}
	render() {
		const nodes = this.state.subTags.map((tag, index) => {
			return (<LogContent key={index} tag={tag} />);
		});
		return (
			<div className='contentListContainer pure-g'>
				{nodes}
			</div>
		);
	}
}

class LogContent extends React.Component {
	constructor(props) {
		super(props);
		const currntTag = props.tag;
		const data = [];
		this.state = {
			data: data,
			interval: 60 * 1000
		};
		this._createdAt = Date.now();
		const update = _.debounce(() => {
			this.setState({
				data: data
			});
		}.bind(this));
		this.onData = (tag, msg) => {
			if (currntTag === tag) {
				data.push(msg);
				console.dir(data.length)
				update();
			}
		};
	}
	componentDidMount() {
		log.on('data', this.onData);
	}
	componentWillUnmount() {
		log.off('data', this.onData);	
	}
	render() {
		const interval = this.state.interval;
		const createdAt = this._createdAt;
		let currentIndex = -1;
		const format = (str) => {
			const dateLenth = 24;
			const index = str.indexOf(']');
			const date = new Date(str.substring(0, dateLenth));
			let dateStr;
			if (!interval) {
				dateStr = (<span className='time'>{moment(date).format('YYYY-MM-DD HH:mm:ss.SSS')}</span>);
			} else {
				const currentTimestamp = date.getTime();
				const tmp = Math.floor((date.getTime() - createdAt) / interval)
				if (tmp > currentIndex) {
					dateStr = (<span className='intervalTime'>{moment(date).format('YYYY-MM-DD HH:mm:ss.SSS')}</span>);
					currentIndex = tmp;
				}
			}

			return {
				date: dateStr,
				type: str.substring(dateLenth, index + 1).trim(),
				msg: str.substring(index + 1)
			};
		};
		const nodes = this.state.data.map((msg, i) => {
			const data = format(msg);
			const type = data.type;
			const itemCss = {
				type: true
			};
			itemCss[type.substring(1, type.length - 1)] = true;
			return (
				<p key={i}>
					{data.date}
					<span className={classnames(itemCss)}>{data.type}</span>
					{data.msg}
				</p>
			);
		});

		return (
			<div className='logContent pure-u-1-2'>
				<div className='tag'>{this.props.tag}</div>
				{nodes}
			</div>
		);
	}
}


class LogTagList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: log.getTags() || [],
			selectedTags: []
		};
	}

	componentDidMount() {
		log.on('tags', (tagInfos) => {
			this.setState({
				tags: tagInfos
			});
		});
	}

	toggleTag(e) {
		e.preventDefault();
		const tag = e.target.innerText;
		const selectedTags = this.state.selectedTags;
		const index = _.indexOf(selectedTags, tag);
		if (~index) {
			selectedTags.splice(index, 1);
			log.unsub(tag)
		} else {
			selectedTags.push(tag);
			log.sub(tag);
		}
		this.setState({
			selectedTags : selectedTags
		});
		emitter.emit('selectTags', selectedTags);
	}

	render() {
		const selectedTags = this.state.selectedTags;
		const nodes = this.state.tags.map(tag => {
			const cs = classnames({
				active: ~_.indexOf(selectedTags, tag.name)
			});
			return (<li key={tag.name} className={cs}>
				<a href='javascript:' onClick={this.toggleTag.bind(this)}>{tag.name}</a>
			</li>);
		});
		return (
			<ul>{nodes}</ul>
		);
	}
}



ReactDOM.render(<LogTagList /> ,
	document.getElementById('logTagListContaienr')
);

ReactDOM.render(<LogContentList />,
	document.getElementById('logContentListContainer')
);


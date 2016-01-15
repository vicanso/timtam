'use strict';
import * as log from '../components/log';
import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import _ from 'lodash';
import Emitter from 'component-emitter';
import moment from 'moment';
import debug from '../components/debug';

const emitter = new Emitter();


log.on('data', (tag, msg) => {
	debug('tag:%s, msg:%s', tag, msg);
	emitter.emit(`log-${tag}`, msg);
});

class LogContentList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subTags : []
		};
	}
	onSelectTags(tags) {
		debug('on select tags:%j', tags);
		this.setState({
			subTags : tags
		});
	}
	componentDidMount() {
		emitter.on('selectTags', this.onSelectTags.bind(this));
	}
	componentWillUnmount() {
		emitter.off('selectedTags', this.onSelectTags.bind(this));
	}
	render() {
		const nodes = this.state.subTags.map(tag => {
			return (<LogContent key={tag} tag={tag} />);
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
		const currentTag = props.tag;
		this.state = {
			data: [],
			keyword: '',
			interval: 60 * 1000,
			showFilter: false
		};
		this._update = _.debounce(() => {
			this.forceUpdate();
		}, 50);
		this.onChange = _.throttle((e) => {
			const value = e.target.value.trim();
			this.setState({
				keyword: value
			});
		}, 3000);
	}
	onData(msg) {
		this.state.data.push(msg);
		this._update();
	}
	toggleFilter() {
		this.setState({
			showFilter: !this.state.showFilter
		});
	}
	componentDidMount() {
		const tag = this.props.tag;
		emitter.on(`log-${tag}`, this.onData.bind(this));
	}
	componentWillUnmount() {
		const tag = this.props.tag;
		emitter.off(`log-${tag}`, this.onData.bind(this));
		this._update.cancel();
	}
	render() {
		const interval = this.state.interval;
		const createdAt = 0;
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
					dateStr = (<span className='intervalTime'>{moment(date).format('YYYY-MM-DD HH:mm:ss')}</span>);
					currentIndex = tmp;
				}
			}

			return {
				date: date,
				dateStr: dateStr,
				type: str.substring(dateLenth, index + 1).trim(),
				msg: str.substring(index + 1)
			};
		};
		let arr = this.state.data;
		if (this.state.keyword) {
			const reg = new RegExp(this.state.keyword, 'gi');
			const filterArr = [];
			_.each(arr, (msg) => {
				const result = _.get(msg.match(reg), '[0]');
				if (result) {
					msg = msg.replace(new RegExp(result, 'gi'), `<span class='keyword'>${result}</span>`);
					filterArr.push(msg);
				};
			});
			arr = filterArr;
		}
		const nodes = arr.map((msg, i) => {
			const data = format(msg);
			const type = data.type;
			const itemCss = {
				type: true
			};
			itemCss[type.substring(1, type.length - 1)] = true;
			return (
				<p key={i + data.date}>
					{data.dateStr}
					<span className={classnames(itemCss)}>{data.type}</span>
					<span dangerouslySetInnerHTML={{__html: data.msg}}></span>
				</p>
			);
		});
		const filterContainerClass = classnames({
			filterContainer: true,
			'pure-form': true,
			hidden: !this.state.showFilter
		});
		return (
			<div className='logContent pure-u-1'>
				<a className='filterToggle' href='javascript:;' onClick={this.toggleFilter.bind(this)}>F</a>
				<div className={filterContainerClass}>
					<div className='tag'>{this.props.tag}</div>
					<a className='pullRight' href='javascript:;' onClick={this.toggleFilter.bind(this)}>X</a>
					<input type='text' placeholder='keyword' onChange={this.onChange.bind(this)} />
				</div>
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


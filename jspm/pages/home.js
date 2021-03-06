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
		const itemClass = 'row-' + this.state.subTags.length;
		const nodes = this.state.subTags.map(tag => {
			return (<LogContent itemClass={itemClass} key={tag} tag={tag} />);
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
			// 关键字
			keyword: '',
			// 时间显示间隔
			interval: 60,
			// 最大日志数量
			max: 1000,
			// 是否显示filter
			showFilter: false,
			// 是否固定底部
			shouldScrollBottom: true
		};
		this._update = _.throttle(this.forceUpdate.bind(this), 50);
		this._changeKeyword = _.debounce(this.changeKeyword.bind(this), 1500);
		this._changeInterval = _.debounce(this.changeInterval.bind(this), 1500);
		this._changeLogMax = _.debounce(this.changeLogMax.bind(this), 1500);
		this._onData = this.onData.bind(this);
	}
	onData(msg) {
		const data = this.state.data;
		const max = this.state.max;
		if (data.length >= max) {
			data.splice(0, 100);
		}
		data.push(msg);
		this._update();
	}
	toggleFilter() {
		this.setState({
			showFilter: !this.state.showFilter
		});
	}
	changeKeyword(e) {
		const value = e.target.value.trim();
		this.setState({
			keyword: value
		});
	}
	changeInterval(e) {
		const value = parseInt(e.target.value.trim());
		if (_.isNaN(value)) {
			return;
		}
		this.setState({
			interval: value
		});
	}
	changeLogMax(e) {
		const value = parseInt(e.target.value.trim());
		if (_.isNaN(value) || value < 100) {
			return;
		}

		this.setState({
			max: value
		});
	}
	toggleShouldScrollBottom() {
		this.setState({
			shouldScrollBottom: !this.state.shouldScrollBottom
		});
	}
	componentDidMount() {
		const tag = this.props.tag;
		emitter.on(`log-${tag}`, this._onData);
	}
	componentWillUnmount() {
		const tag = this.props.tag;
		emitter.off(`log-${tag}`, this._onData);
		this._update.cancel();
	}
	componentDidUpdate() {
		if (this.state.shouldScrollBottom) {
			const dom = _.last(ReactDOM.findDOMNode(this).children);
			dom.scrollTop = Number.MAX_VALUE;
		}
	}
	getLogNodes(arr) {
		const interval = this.state.interval * 1000;
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
				const tmp = Math.floor(date.getTime() / interval);
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

		return arr.map((msg, i) => {
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
	}
	render() {
		const state = this.state;
		let arr = state.data;
		if (state.keyword) {
			const reg = new RegExp(state.keyword, 'gi');
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
		const nodes = this.getLogNodes(arr);
		const filterContainerClass = classnames({
			filterContainer: true,
			'pure-form': true,
			isHidden: !state.showFilter
		});
		const contentClass = {
			logContentContainer: true,
			'pure-u-1': true
		};
		contentClass[this.props.itemClass] = true;
		return (
			<div className={classnames(contentClass)}>
				<div className={filterContainerClass}>
					<a className='tag' href='javascript:;' onClick={this.toggleFilter.bind(this)}>{this.props.tag}</a>
					<input type='text' placeholder='filter keyword' onChange={this._changeKeyword} value={state.keyword} />
					<label className='mleft15'>Time interval - </label>
					<input type='number' placeholder='seconds, default:60' onChange={this._changeInterval} value={state.interval} />
					<label className='mleft15'>Log max - </label>
					<input type='number' placeholder='[100-*],default:1000' onChange={this._changeLogMax} value={state.max} />
					<label className='mleft15'>Scroll to bottom - </label>
					<input type='checkbox' checked={state.shouldScrollBottom} onChange={this.toggleShouldScrollBottom.bind(this)} /> 
				</div>
				<div className='content'>
					{nodes}
				</div>
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
				active: ~_.indexOf(selectedTags, tag.name),
				smallFont: tag.name.length >= 10
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


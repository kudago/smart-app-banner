!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.SmartBanner=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var extend = require('xtend/mutable');
var q = require('component-query');
var doc = require('get-doc');
var root = doc && doc.documentElement;
var cookie = require('cookie-cutter');


// platform dependent functionality
var mixins = {
	ios: {
		appMeta: 'apple-itunes-app',
		iconRels: ['apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function() {
			return 'https://itunes.apple.com/' + this.options.appStoreLanguage + '/app/id' + this.appId;
		}
	},
	android: {
		appMeta: 'google-play-app',
		iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function() {
			return 'http://play.google.com/store/apps/details?id=' + this.appId;
		}
	}
};

var SmartBanner = function(options) {
	var userAgent = navigator.userAgent;
	this.options = extend({}, {
		daysHidden: 15,
		daysReminder: 90,
		appStoreLanguage: 'us', // Language code for App Store
		button: 'OPEN', // Text for the install button
		store: {
			ios: 'On the App Store',
			android: 'In Google Play'
		},
		price: {
			ios: 'FREE',
			android: 'FREE'
		},
		force: false // put platform type (ios, android, etc.) here for emulation
	}, options || {});

	if (this.options.force) {
		this.type = this.options.force;
	} else if (userAgent.match(/iPad|iPhone|iPod/i) !== null) {
		if (userAgent.match(/Safari/i) !== null &&
				(userAgent.match(/CriOS/i) !== null ||
				Number(userAgent.substr(userAgent.indexOf('OS ') + 3, 3).replace('_', '.')) < 6)) {
			this.type = 'ios';
		} // Check webview and native smart banner support (iOS 6+)
	} else if (userAgent.match(/Android/i) !== null) {
		this.type = 'android';
	}

	// Don't show banner if device isn't iOS or Android, website is loaded in app, user dismissed banner, or we have no app id in meta
	if (!this.type
		|| navigator.standalone
		|| cookie.get('smartbanner-closed')
		|| cookie.get('smartbanner-installed')) {
		return;
	}

	extend(this, mixins[this.type]);

	if (!this.parseAppId()) {
		return;
	}

	this.create();
	this.show();
};

SmartBanner.prototype = {
	constructor: SmartBanner,

	create: function() {
		var link = this.getStoreLink();
		var inStore = this.options.price[this.type] + ' - ' + this.options.store[this.type];
		var icon;
		for (var i = 0; i < this.iconRels.length; i++) {
			var rel = q('link[rel="'+this.iconRels[i]+'"]');
			if (rel) {
				icon = rel.getAttribute('href');
				break;
			}
		}

		var sb = doc.createElement('div');
		sb.className = 'smartbanner smartbanner-' + this.type;

		sb.innerHTML = '<div class="smartbanner-container">' +
							'<a href="javascript:void(0);" class="smartbanner-close">&times;</a>' +
							'<span class="smartbanner-icon" style="background-image: url('+icon+')"></span>' +
							'<div class="smartbanner-info">' +
								'<div class="smartbanner-title">'+this.options.title+'</div>' +
								'<div>'+this.options.author+'</div>' +
								'<span>'+inStore+'</span>' +
							'</div>' +
							'<a href="'+link+'" class="smartbanner-button">' +
								'<span class="smartbanner-button-text">'+this.options.button+'</span>' +
							'</a>' +
						'</div>';

		//there isn’t neccessary a body
		if (doc.body) {
			doc.body.appendChild(sb);
		}
		else if (doc) {
			doc.addEventListener('DOMContentLoaded', function(){
				doc.body.appendChild(sb);
			});
		}

		q('.smartbanner-button', sb).addEventListener('click', this.install.bind(this), false);
		q('.smartbanner-close', sb).addEventListener('click', this.close.bind(this), false);

	},
	hide: function() {
		root.classList.remove('smartbanner-show');
	},
	show: function() {
		root.classList.add('smartbanner-show');
	},
	close: function() {
		this.hide();
		cookie.set('smartbanner-closed', 'true', {
			path: '/',
			expires: +new Date() + this.options.daysHidden * 1000 * 60 * 60 * 24
		});
	},
	install: function() {
		this.hide();
		cookie.set('smartbanner-installed', 'true', {
			path: '/',
			expires: +new Date() + this.options.daysReminder * 1000 * 60 * 60 * 24
		});
	},
	parseAppId: function() {
		var meta = q('meta[name="' + this.appMeta + '"]');
		if (!meta) {
			return;
		}
		this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];

		return this.appId;
	}
};

module.exports = SmartBanner;
},{"component-query":2,"cookie-cutter":3,"get-doc":4,"xtend/mutable":6}],2:[function(require,module,exports){
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

},{}],3:[function(require,module,exports){
var exports = module.exports = function (doc) {
    if (!doc) doc = {};
    if (typeof doc === 'string') doc = { cookie: doc };
    if (doc.cookie === undefined) doc.cookie = '';
    
    var self = {};
    self.get = function (key) {
        var splat = doc.cookie.split(/;\s*/);
        for (var i = 0; i < splat.length; i++) {
            var ps = splat[i].split('=');
            var k = unescape(ps[0]);
            if (k === key) return unescape(ps[1]);
        }
        return undefined;
    };
    
    self.set = function (key, value, opts) {
        if (!opts) opts = {};
        var s = escape(key) + '=' + escape(value);
        if (opts.expires) s += '; expires=' + opts.expires;
        if (opts.path) s += '; path=' + escape(opts.path);
        doc.cookie = s;
        return s;
    };
    return self;
};

if (typeof document !== 'undefined') {
    var cookie = exports(document);
    exports.get = cookie.get;
    exports.set = cookie.set;
}

},{}],4:[function(require,module,exports){
/**
 * @module  get-doc
 */

var hasDom = require('has-dom');

module.exports = hasDom() ? document : null;
},{"has-dom":5}],5:[function(require,module,exports){
'use strict';
module.exports = function () {
	return typeof window !== 'undefined'
		&& typeof document !== 'undefined'
		&& typeof document.createElement === 'function';
};

},{}],6:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[1])(1)
});
'use strict';

var extend = require('object-assign');
var q = require('component-query');
var doc = require('get-doc');
var cookie = require('cookie-cutter');
var ua = require('ua-parser-js');

// IE < 11 doesn't support navigator language property.
/* global navigator */
var userLangAttribute = navigator.language || navigator.userLanguage || navigator.browserLanguage;
var userLang = userLangAttribute.slice(-2) || 'us';
var root = doc && doc.documentElement;

// platform dependent functionality
var mixins = {
	ios: {
		appMeta: 'apple-itunes-app',
		iconRels: ['apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function () {
			return 'https://itunes.apple.com/' + this.options.appStoreLanguage + '/app/id' + this.appId + "?mt=8";
		}
	},
	android: {
		appMeta: 'google-play-app',
		iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function () {
			return 'http://play.google.com/store/apps/details?id=' + this.appId;
		}
	},
	windows: {
		appMeta: 'msApplication-ID',
		iconRels: ['windows-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function () {
			return 'http://www.windowsphone.com/s?appid=' + this.appId;
		}
	}
};

var SmartBanner = function (options) {
	var agent = ua(navigator.userAgent);
	this.options = extend({}, {
		daysHidden: 15,
		daysReminder: 90,
		appStoreLanguage: userLang, // Language code for App Store
		button: 'OPEN', // Text for the install button
		store: {
			ios: 'On the App Store',
			android: 'In Google Play',
			windows: 'In the Windows Store'
		},
		price: {
			ios: 'FREE',
			android: 'FREE',
			windows: 'FREE'
		},
		theme: '', // put platform type ('ios', 'android', etc.) here to force single theme on all device
		icon: '', // full path to icon image if not using website icon image
		force: '', // put platform type ('ios', 'android', etc.) here for emulation

	}, options || {});

	if (this.options.force) {
		this.type = this.options.force;
	} else if (agent.os.name === 'Windows Phone' || agent.os.name === 'Windows Mobile') {
		this.type = 'windows';
	} else if (agent.os.name === 'iOS') {
		this.type = 'ios';
	} else if (agent.os.name === 'Android') {
		this.type = 'android';
	}

	// Don't show banner on ANY of the following conditions:
	// - device os is not supported,
	// - user is on mobile safari for ios 6 or greater (iOS >= 6 has native support for SmartAppBanner)
	// - running on standalone mode
	// - user dismissed banner
	var unsupported = !this.type || !this.options.store[this.type];
	if (unsupported) {
		return;
	}

	this.appMeta = mixins[this.type].appMeta;
	this.parseAppId();

	var isMobileSafari = (this.type === 'ios' && agent.browser.name === 'Mobile Safari' && parseInt(agent.os.version, 10) >= 6);

	var runningStandAlone = navigator.standalone;
	var userDismissed = cookie.get(this.appId + '-smartbanner-closed');
	var userInstalled = cookie.get(this.appId + '-smartbanner-installed');

	if (isMobileSafari || runningStandAlone || userDismissed || userInstalled) {
		return;
	}

	extend(this, mixins[this.type]);

	// - If we dont have app id in meta, dont display the banner
	// - If opened in safari IOS, dont display the banner
	if (!this.appId && agent.os.name === 'IOS' && agent.browser.name === 'Safari') {
		return;
	}

	this.create();
	this.show();
};

SmartBanner.prototype = {
	constructor: SmartBanner,

	create: function () {
		var link = this.getStoreLink();
		var inStore = this.options.price[this.type] + ' - ' + this.options.store[this.type];
		var icon;

		if (this.options.icon) {
			icon = this.options.icon;
		} else {
			for (var i = 0; i < this.iconRels.length; i++) {
				var rel = q('link[rel="' + this.iconRels[i] + '"]');

				if (rel) {
					icon = rel.getAttribute('href');
					break;
				}
			}
		}

		var sb = doc.createElement('div');
		var theme = this.options.theme || this.type;

		sb.className = 'smartbanner smartbanner-' + theme;
		sb.innerHTML = '<div class="smartbanner-container">' +
							'<a href="javascript:void(0);" class="smartbanner-close">&times;</a>' +
							'<span class="smartbanner-icon" style="background-image: url(' + icon + ')"></span>' +
							'<div class="smartbanner-info">' +
								'<div class="smartbanner-title">' + this.options.title + '</div>' +
								'<div>' + this.options.author + '</div>' +
								'<span>' + inStore + '</span>' +
							'</div>' +
							'<a href="' + link + '" class="smartbanner-button">' +
								'<span class="smartbanner-button-text">' + this.options.button + '</span>' +
							'</a>' +
						'</div>';

		// there isn’t neccessary a body
		if (doc.body) {
			doc.body.appendChild(sb);
		}		else if (doc) {
			doc.addEventListener('DOMContentLoaded', function () {
				doc.body.appendChild(sb);
			});
		}

		q('.smartbanner-button', sb).addEventListener('click', this.install.bind(this), false);
		q('.smartbanner-close', sb).addEventListener('click', this.close.bind(this), false);
	},
	hide: function () {
		root.classList.remove('smartbanner-show');

		if (typeof this.options.close === 'function') {
			return this.options.close();
		}
	},
	show: function () {
		root.classList.add('smartbanner-show');
		if (typeof this.options.show === 'function') {
			return this.options.show();
		}
	},
	close: function () {
		this.hide();
		cookie.set(this.appId + '-smartbanner-closed', 'true', {
			path: '/',
			expires: new Date(Number(new Date()) + (this.options.daysHidden * 1000 * 60 * 60 * 24))
		});
		if (typeof this.options.close === 'function') {
			return this.options.close();
		}
	},
	install: function () {
		this.hide();
		cookie.set(this.appId + '-smartbanner-installed', 'true', {
			path: '/',
			expires: new Date(Number(new Date()) + (this.options.daysReminder * 1000 * 60 * 60 * 24))
		});
		if (typeof this.options.close === 'function') {
			return this.options.close();
		}
	},
	parseAppId: function () {
		var meta = q('meta[name="' + this.appMeta + '"]');
		if (!meta) {
			return;
		}

		if (this.type === 'windows') {
			this.appId = meta.getAttribute('content');
		} else {
			this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];
		}

		return this.appId;
	}
};

module.exports = SmartBanner;

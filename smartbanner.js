/*!
 * Lightweight Smart Banner with no frameworks requirement
 * Based on 'jQuery Smart Banner' by Arnold Daniels <arnold@jasny.net> https://github.com/jasny/jquery.smartbanner
 */
/*global navigator, window, document */
(function () {
    'use strict';

    // Simple object extend function
    var extend = function(where) {
        Array.prototype.slice.call(arguments, 1).forEach(function(source) {
            var key;
            for (key in source) {
                if (source.hasOwnProperty(key)) {
                    where[key] = source[key];
                }
            }
        });
        return where;
    };

    // Simple one element selector function
    var $ = function(selector, element) {
        var el = element || document.documentElement;
        return el.querySelector(selector);
    };

    // Bind for old safari
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(obj) {
            var args = [].slice.call(arguments, 1),
                self = this,
                nop = function() {},
                bound = function() {
                    return self.apply(this instanceof nop ? this : (obj || {}),
                        args.concat([].slice.call(arguments)));
                };
            nop.prototype = self.prototype;
            bound.prototype = new nop();
            return bound;
        };
    }

    var addClass, removeClass;
    var e = document.createElement('input');
    if ('classList' in e) {
        addClass = function (el, c) {
            el.classList.add(c);
        };
        removeClass = function (el, c) {
            el.classList.remove(c);
        };
    } else {
        var classReg = function (c) {
            return new RegExp('(^|\\s+)' + c + '(\\s+|$)');
        };
        if (!String.prototype.trim) {
            String.prototype.trim = function(s) {
                return s.replace(/(^\s*|\s*$)/g, '');
            }
        }
        addClass = function (el, c) {
            el.className = (el.className + ' ' + c).trim();
        };
        removeClass = function (el, c) {
            el.className = el.className.replace(classReg(c), ' ').trim();
        };
    }

    var getCookie = function(name) {
        var cookies = document.cookie.split(";");

        for (var i=0; i < cookies.length; i++) {
            var x = cookies[i].substr(0, cookies[i].indexOf("="));
            var y = cookies[i].substr(cookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g,"");
            if (x == name) {
                return decodeURIComponent(y);
            }
        }
        return null;
    };

    var setCookie = function(name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        value = encodeURIComponent(value) + (exdays == null ? '' : ('; expires=' + exdate.toUTCString()));
        document.cookie = name + '=' + value + '; path=/;';
    };

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
            button: 'VIEW', // Text for the install button
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
                     window.Number(userAgent.substr(userAgent.indexOf('OS ') + 3, 3).replace('_', '.')) < 6)) {
                this.type = 'ios';
            } // Check webview and native smart banner support (iOS 6+)
        } else if (userAgent.match(/Android/i) !== null) {
            this.type = 'android';
        }

        // Don't show banner if device isn't iOS or Android, website is loaded in app, user dismissed banner, or we have no app id in meta
        if (!this.type
            || navigator.standalone
            || getCookie('smartbanner-closed')
            || getCookie('smartbanner-installed')) {
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
                var rel = $('link[rel="'+this.iconRels[i]+'"]');
                if (rel) {
                    icon = rel.getAttribute('href');
                    break;
                }
            }

            var sb = document.createElement('div');
            addClass(sb, 'smartbanner');
            addClass(sb, 'smartbanner_' + this.type);

            sb.innerHTML = '<div class="smartbanner__container">' +
                                '<a href="javascript:void(0);" class="smartbanner__close">&times;</a>' +
                                '<span class="smartbanner__icon" style="background-image: url('+icon+')"></span>' +
                                '<div class="smartbanner__info">' +
                                    '<div class="smartbanner__title">'+this.options.title+'</div>' +
                                    '<div>'+this.options.author+'</div>' +
                                    '<span>'+inStore+'</span>' +
                                '</div>' +
                                '<a href="'+link+'" class="smartbanner-button">' +
                                    '<span class="smartbanner-button__text">'+this.options.button+'</span>' +
                                '</a>' +
                            '</div>';

            document.body.appendChild(sb);
            $('.smartbanner-button', sb).addEventListener('click', this.install.bind(this), false);
            $('.smartbanner__close', sb).addEventListener('click', this.close.bind(this), false);

        },
        hide: function() {
            removeClass(document.documentElement, 'smartbanner_show');
        },
        show: function() {
            addClass(document.documentElement, 'smartbanner_show');
        },
        close: function() {
            this.hide();
            setCookie('smartbanner-closed', 'true', this.options.daysHidden);
        },
        install: function() {
            this.hide();
            setCookie('smartbanner-installed', 'true', this.options.daysReminder);
        },
        parseAppId: function() {
            var meta = $('meta[name="' + this.appMeta + '"]');
            if (!meta) {
                return;
            }
            this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];

            return this.appId;
        }
    };

    window.SmartBanner = SmartBanner;
}());
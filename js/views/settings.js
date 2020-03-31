
/*global define */

/**
 * Settings module.
 *
 * @module views/settings
 * @requires {@link views/sendMode}
 * @requires {@link views/userInfo} 
 * @requires {@link helpers/page}
 * @namespace views/settings
 */
define({
    name: 'views/settings',
    requires: [
        'views/sendMode',
        'views/userInfo',
        'helpers/page'
    ],
    def: function settings(req) {
        'use strict';

        /**
         * Page helper module instance.
         *
         * @memberof views/settings
         * @private
         * @type {Module}
         */
        var pageHelper = req.helpers.page,
        
        /**
         * Page element.
         *
         * @memberof views/settings
         * @private
         * @type {HTMLElement}
         */
        	page = null;

        /**
         * Handles pagebeforeshow event page element.
         *
         * @memberof views/settings
         * @private
         */
        function onPageBeforeShow() {
            pageHelper.resetScroll(page);
        }

        /**
         * Registers event listeners.
         *
         * @memberof views/settings
         * @private
         */
        function bindEvents() {
           page.addEventListener('pagebeforeshow', onPageBeforeShow);
            
        }

        /**
         * Initializes module.
         *
         * @memberof views/settings
         * @public
         */
        function init() {
            page = document.getElementById('settings');

            bindEvents();
        }

        return {
            init: init
        };
    }
});

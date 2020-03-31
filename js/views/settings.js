
/*global define */

/**
 * Settings module.
 *
 * @module views/settings
 * @requires {@link helpers/page}
 * @requires {@link views/sendMode}
 * @requires {@link views/userInfo} 
 * @namespace views/settings
 */
define({
    name: 'views/settings',
    requires: [
        'helpers/page',
        'views/sendMode',
        'views/userInfo'
    ],
    def: function settings(pageHelper) {
        'use strict';

        /**
         * Page element.
         *
         * @memberof views/settings
         * @private
         * @type {HTMLElement}
         */
        var page = null;

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


/*global define */

/**
 * User Information Input Module.
 *
 * @module views/userInfo 
 * @requires {@link helpers/dom}
 * @requires {@link helpers/page}
 * @namespace views/userInfo
 */
define({
    name: 'views/userInfo',
    requires: [
        'helpers/page',
        'helpers/dom'
    ],
    def: function settings(req) {
        'use strict';

        /**
         * Page element.
         *
         * @memberof views/userInfo
         * @private
         * @type {HTMLElement}
         */
        var page = null;

        var domHelper = req.helpers.dom,
        pageHelper = req.helpers.page;
        /**
         * Handles pagebeforeshow event page element.
         *
         * @memberof views/userInfo
         * @private
         */
        function onPageBeforeShow() {
            pageHelper.resetScroll(page);
        }

        /**
         * Handles click on the button.
         *
         * @memberof views/sendMode
         * @private
         * @param {Event} ev
         */
        function onSubClick(ev) {
            var item = domHelper.closest(ev.target, 'button');

            if (!item) {
                return;
            }

            item = item.querySelector('input');
            history.back();
        }
        
        /**
         * Registers event listeners.
         *
         * @memberof views/userInfo
         * @private
         */
        function bindEvents() {
            page.addEventListener('pagebeforeshow', onPageBeforeShow);

            page.querySelector('button').addEventListener('click', onSubClick);
        }

        /**
         * Initializes module.
         *
         * @memberof views/userInfo
         * @public
         */
        function init() {
            page = document.getElementById('user');

            bindEvents();
        }

        return {
            init: init
        };
    }
});

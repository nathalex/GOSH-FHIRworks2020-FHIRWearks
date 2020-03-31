/*
 *      Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global define, document, history */

/**
 * send mode view module.
 *
 * @module views/sendMode
 * @requires {@link helpers/dom}
 * @requires {@link helpers/page}
 * @namespace views/sendMode
 */
define({
    name: 'views/sendMode',
    requires: [
        'helpers/dom',
        'helpers/page'
    ],
    def: function display(req) {
        'use strict';

        /**
         * DOM helper module.
         *
         * @memberof views/sendMode
         * @private
         * @type {Module}
         */
        var domHelper = req.helpers.dom,

            /**
             * Page helper module instance.
             *
             * @memberof views/sendMode
             * @private
             * @type {Module}
             */
            pageHelper = req.helpers.page,

            /**
             * Current mode value.
             *
             * @memberof views/sendMode
             * @private
             * @type {string}
             */
            currentValue = 'manual',

            /**
             * Page element.
             *
             * @memberof views/sendMode
             * @private
             * @type {HTMLElement}
             */
            page = null;

        /**
         * Handles click on the list.
         *
         * @memberof views/sendMode
         * @private
         * @param {Event} ev
         */
        function onListClick(ev) {
            var item = domHelper.closest(ev.target, 'li');

            if (!item) {
                return;
            }

            item = item.querySelector('input');
            currentValue = item.getAttribute('value');
            history.back();
        }

        /**
         * Returns current value of the send mode.
         *
         * @memberof views/sendMode
         * @public
         * @returns {string}
         */
        function getCurrentValue() {
            return currentValue;
        }

        /**
         * Handles "pagebeforeshow" event.
         *
         * @memberof views/sendMode
         * @private
         */
        function onPageBeforeShow() {
            pageHelper.resetScroll(page);
            page.querySelector('[value="' + currentValue + '"]').checked = true;
        }

        /**
         * Registers module's event listeners.
         *
         * @memberof views/sendMode
         * @private
         */
        function bindEvents() {
            page.addEventListener('pagebeforeshow', onPageBeforeShow);
            page.querySelector('ul').addEventListener('click', onListClick);
        }

        /**
         * Initializes module.
         *
         * @memberof views/sendMode
         * @public
         */
        function init() {
            page = document.getElementById('sendsettings');

            bindEvents();
        }

        return {
            init: init,
            getCurrentValue: getCurrentValue
        };
    }
});

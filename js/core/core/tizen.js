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
 
/*global define*/
 
/**
 * Tizen module.
 * Module returns tizen global object.
 * @namespace core/tizen
 *
 * @example
 * //Define `foo` module which require `core/tizen` module:
 * define({
 *     name: 'foo',
 *     requires: ['core/tizen'],
 *     def: function (tizen) {
 *          var systeminfo = tizen.systeminfo;
 *     }
 * });
 */
 
define({
    name: 'core/tizen',
    requires: ['core/window'],
    def: function coreTizen(win) {
        'use strict';
 
        return win.tizen;
    }
});
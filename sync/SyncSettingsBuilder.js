"use strict";
var Arrays = require("../../ts-mortar/utils/Arrays");
/** Builder for SyncSettings, SyncUpSettings, and SyncDownSettings instances.
 * Both SyncUpSettings and SyncDownSettings require a base SyncSettings instance to build on top of.
 * SyncUpSettings and SyncDownSettings can be combined, but only one is required.
 * So using this class normally looks like:
 *   new SyncSettingsBuilder()
 *     .addSettings(...)
 *     .addSyncUpSettings(...)
 * AND/OR
 *     .addSyncDownSettings(...)
 * THEN
 *     .build()
 *
 * @template E the base local data type
 * @template F the base local data type with optional parameters for creating query objects
 * @template P sync up parameters
 * @template S remote data type
 * @template U sync up result
 * @template R sync error
 *
 * @author TeamworkGuy2
 * @since 2016-3-7
 */
var SyncSettingsBuilder = (function () {
    function SyncSettingsBuilder() {
    }
    SyncSettingsBuilder.prototype.addSettings = function (localCollection, primaryKeys, hasPrimaryKeyCheckers, findFilterFunc, copyObjectFunc) {
        this.localCollection = localCollection;
        this.primaryKeys = Arrays.asArray(primaryKeys);
        this.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
        this.findFilterFunc = findFilterFunc;
        this.copyObjectFunc = copyObjectFunc;
        return this;
    };
    SyncSettingsBuilder.prototype.addSyncDownUrl = function (syncDownUrl, convertToLocalObjectFunc) {
        this.syncDownFunc = this.convertUrlToSyncDownFunc(syncDownUrl);
        this.convertToLocalObjectFunc = convertToLocalObjectFunc;
        return this;
    };
    SyncSettingsBuilder.prototype.addSyncDownFunc = function (syncDownFunc, convertToLocalObjectFunc) {
        this.syncDownFunc = syncDownFunc;
        this.convertToLocalObjectFunc = convertToLocalObjectFunc;
        return this;
    };
    SyncSettingsBuilder.prototype.addSyncUpUrl = function (syncUpUrl, convertToSvcObjectFunc) {
        this.syncUpFunc = this.convertUrlToSyncUpFunc(syncUpUrl);
        this.convertToSvcObjectFunc = convertToSvcObjectFunc;
        return this;
    };
    SyncSettingsBuilder.prototype.addSyncUpFunc = function (syncUpFunc, convertToSvcObjectFunc) {
        this.syncUpFunc = syncUpFunc;
        this.convertToSvcObjectFunc = convertToSvcObjectFunc;
        return this;
    };
    SyncSettingsBuilder.prototype.build = function () {
        return this;
    };
    SyncSettingsBuilder.copy = function (src, deepCopy) {
        if (deepCopy === void 0) { deepCopy = true; }
        if (deepCopy) {
            return new SyncSettingsBuilder().addSettings(src.localCollection, src.primaryKeys, src.hasPrimaryKeyCheckers, src.findFilterFunc, src.copyObjectFunc)
                .addSyncDownFunc(src.syncDownFunc, src.convertToLocalObjectFunc)
                .addSyncUpFunc(src.syncUpFunc, src.convertToSvcObjectFunc);
        }
        return new SyncSettingsBuilder().addSettings(src.localCollection, src.primaryKeys, src.hasPrimaryKeyCheckers, src.findFilterFunc, src.copyObjectFunc)
            .addSyncDownFunc(src.syncDownFunc, src.convertToLocalObjectFunc)
            .addSyncUpFunc(src.syncUpFunc, src.convertToSvcObjectFunc);
    };
    SyncSettingsBuilder.fromSettingsConvert = function (localCollection, primaryKeys, hasPrimaryKeyCheckers, findFilterFunc, copyObjectFunc, convertUrlToSyncDownFunc, convertUrlToSyncUpFunc) {
        var inst = new SyncSettingsBuilder();
        inst.localCollection = localCollection;
        inst.primaryKeys = Arrays.asArray(primaryKeys);
        inst.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
        inst.findFilterFunc = findFilterFunc;
        inst.copyObjectFunc = copyObjectFunc;
        inst.convertUrlToSyncDownFunc = convertUrlToSyncDownFunc;
        inst.convertUrlToSyncUpFunc = convertUrlToSyncUpFunc;
        return inst;
    };
    SyncSettingsBuilder.fromSettings = function (localCollection, primaryKeys, hasPrimaryKeyCheckers, findFilterFunc, copyObjectFunc) {
        var inst = new SyncSettingsBuilder();
        inst.localCollection = localCollection;
        inst.primaryKeys = Arrays.asArray(primaryKeys);
        inst.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
        inst.findFilterFunc = findFilterFunc;
        inst.copyObjectFunc = copyObjectFunc;
        return inst;
    };
    SyncSettingsBuilder.fromSettingsObj = function (settings) {
        var inst = new SyncSettingsBuilder();
        inst.localCollection = settings.localCollection;
        inst.primaryKeys = settings.primaryKeys;
        inst.hasPrimaryKeyCheckers = settings.hasPrimaryKeyCheckers;
        inst.findFilterFunc = settings.findFilterFunc;
        inst.copyObjectFunc = settings.copyObjectFunc;
        return inst;
    };
    SyncSettingsBuilder.fromDataCollectionAndSyncFuncs = function (table, syncDownFunc, syncUpFunc) {
        var tableModel = table.getDataModel();
        var tableFuncs = table.getDataModelFuncs();
        var inst = new SyncSettingsBuilder();
        // sync settings
        inst.localCollection = table;
        inst.primaryKeys = tableModel.primaryKeys;
        inst.hasPrimaryKeyCheckers = tableModel.primaryKeys.map(function (k) { return function (itm) { return !!itm[k]; }; });
        inst.copyObjectFunc = tableFuncs.copyFunc;
        // sync down
        inst.syncDownFunc = syncDownFunc;
        inst.convertToLocalObjectFunc = tableFuncs.convertToLocalObjectFunc;
        // sync up
        inst.syncUpFunc = syncUpFunc;
        inst.convertToSvcObjectFunc = tableFuncs.convertToSvcObjectFunc;
        return {
            addFilterFuncs: function (findFilterFunc) {
                inst.findFilterFunc = findFilterFunc;
                return inst;
            }
        };
    };
    return SyncSettingsBuilder;
}());
(function (SyncSettingsBuilder) {
    /** SyncSettings class
     * Settings for syncing server data to and from a local data collection
     */
    var SyncSettingsImpl = (function () {
        function SyncSettingsImpl(localCollection, primaryKeys, hasPrimaryKeyCheckers, findFilterFunc, copyObj, convertUrlToSyncDownFunc, convertUrlToSyncUpFunc) {
            this.localCollection = localCollection;
            this.primaryKeys = Arrays.asArray(primaryKeys);
            this.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
            this.findFilterFunc = findFilterFunc;
            this.copyObjectFunc = copyObj;
            this.convertUrlToSyncDownFunc = convertUrlToSyncDownFunc;
            this.convertUrlToSyncUpFunc = convertUrlToSyncUpFunc;
        }
        SyncSettingsImpl.copy = function (src) {
            return new SyncSettingsImpl(src.localCollection, src.primaryKeys, src.hasPrimaryKeyCheckers, src.findFilterFunc, src.copyObjectFunc, src.convertUrlToSyncDownFunc, src.convertUrlToSyncUpFunc);
        };
        return SyncSettingsImpl;
    }());
    SyncSettingsBuilder.SyncSettingsImpl = SyncSettingsImpl;
    /** Settings for syncing up (uploading) server data from a local data collection
     */
    var SyncUpSettingsImpl = (function () {
        function SyncUpSettingsImpl(syncUpFunc, toSvcObj) {
            this.syncUpFunc = syncUpFunc;
            this.convertToSvcObjectFunc = toSvcObj;
        }
        SyncUpSettingsImpl.copy = function (src) {
            return new SyncUpSettingsImpl(src.syncUpFunc, src.convertToSvcObjectFunc);
        };
        return SyncUpSettingsImpl;
    }());
    SyncSettingsBuilder.SyncUpSettingsImpl = SyncUpSettingsImpl;
    /** Settings for syncing down (downloading) server data to a local data collection
     */
    var SyncDownSettingsImpl = (function () {
        function SyncDownSettingsImpl(syncDownFunc, toLocalObj) {
            this.syncDownFunc = syncDownFunc;
            this.convertToLocalObjectFunc = toLocalObj;
        }
        SyncDownSettingsImpl.copy = function (src) {
            return new SyncDownSettingsImpl(src.syncDownFunc, src.convertToLocalObjectFunc);
        };
        return SyncDownSettingsImpl;
    }());
    SyncSettingsBuilder.SyncDownSettingsImpl = SyncDownSettingsImpl;
})(SyncSettingsBuilder || (SyncSettingsBuilder = {}));
module.exports = SyncSettingsBuilder;

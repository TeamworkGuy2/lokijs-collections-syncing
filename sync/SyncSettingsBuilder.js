"use strict";
var Arrays = require("ts-mortar/utils/Arrays");
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
var SyncSettingsBuilder = /** @class */ (function () {
    function SyncSettingsBuilder() {
    }
    SyncSettingsBuilder.prototype.addSettings = function (localCollection, primaryKeys, hasPrimaryKeyCheckers, findFilterFunc, copyObjectFunc) {
        this.localCollection = localCollection;
        this.primaryKeys = primaryKeys;
        this.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
        this.findFilterFunc = findFilterFunc;
        this.copyObjectFunc = copyObjectFunc;
        return this;
    };
    SyncSettingsBuilder.prototype.addSyncDownUrl = function (syncDownUrl, toLocalObject) {
        this.syncDownFunc = this.convertUrlToSyncDownFunc(syncDownUrl);
        this.toLocalObject = toLocalObject;
        return this;
    };
    SyncSettingsBuilder.prototype.addSyncDownFunc = function (syncDownFunc, toLocalObject) {
        this.syncDownFunc = syncDownFunc;
        this.toLocalObject = toLocalObject;
        return this;
    };
    SyncSettingsBuilder.prototype.addSyncUpUrl = function (syncUpUrl, toSvcObject) {
        this.syncUpFunc = this.convertUrlToSyncUpFunc(syncUpUrl);
        this.toSvcObject = toSvcObject;
        return this;
    };
    SyncSettingsBuilder.prototype.addSyncUpFunc = function (syncUpFunc, toSvcObject) {
        this.syncUpFunc = syncUpFunc;
        this.toSvcObject = toSvcObject;
        return this;
    };
    SyncSettingsBuilder.prototype.build = function () {
        return this;
    };
    SyncSettingsBuilder.copy = function (src, deepCopy) {
        if (deepCopy === void 0) { deepCopy = true; }
        if (deepCopy) {
            return new SyncSettingsBuilder().addSettings(src.localCollection, src.primaryKeys, src.hasPrimaryKeyCheckers, src.findFilterFunc, src.copyObjectFunc)
                .addSyncDownFunc(src.syncDownFunc, src.toLocalObject)
                .addSyncUpFunc(src.syncUpFunc, src.toSvcObject);
        }
        return new SyncSettingsBuilder().addSettings(src.localCollection, src.primaryKeys, src.hasPrimaryKeyCheckers, src.findFilterFunc, src.copyObjectFunc)
            .addSyncDownFunc(src.syncDownFunc, src.toLocalObject)
            .addSyncUpFunc(src.syncUpFunc, src.toSvcObject);
    };
    SyncSettingsBuilder.fromSettingsConvert = function (localCollection, primaryKeys, hasPrimaryKeyCheckers, findFilterFunc, copyObjectFunc, convertUrlToSyncDownFunc, convertUrlToSyncUpFunc) {
        var inst = new SyncSettingsBuilder();
        inst.localCollection = localCollection;
        inst.primaryKeys = primaryKeys;
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
        inst.primaryKeys = primaryKeys;
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
    SyncSettingsBuilder.fromDataCollectionAndSyncFuncs = function (localCollection, syncDownFunc, syncUpFunc) {
        var collModel = localCollection.getDataModel();
        var collFuncs = localCollection.getDataModelFuncs();
        var inst = new SyncSettingsBuilder();
        // sync settings
        inst.localCollection = localCollection;
        inst.primaryKeys = collModel.primaryKeys;
        inst.hasPrimaryKeyCheckers = collModel.primaryKeys.map(function (k) { return function (itm) { return !!itm[k]; }; });
        inst.copyObjectFunc = collFuncs.copyFunc;
        // sync down
        inst.syncDownFunc = syncDownFunc;
        inst.toLocalObject = collFuncs.toLocalObject;
        // sync up
        inst.syncUpFunc = syncUpFunc;
        inst.toSvcObject = collFuncs.toSvcObject;
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
    var SyncSettingsImpl = /** @class */ (function () {
        function SyncSettingsImpl(localCollection, primaryKeys, hasPrimaryKeyCheckers, findFilterFunc, copyObj, convertUrlToSyncDownFunc, convertUrlToSyncUpFunc) {
            this.localCollection = localCollection;
            this.primaryKeys = primaryKeys;
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
    var SyncUpSettingsImpl = /** @class */ (function () {
        function SyncUpSettingsImpl(syncUpFunc, toSvcObj) {
            this.syncUpFunc = syncUpFunc;
            this.toSvcObject = toSvcObj;
        }
        SyncUpSettingsImpl.copy = function (src) {
            return new SyncUpSettingsImpl(src.syncUpFunc, src.toSvcObject);
        };
        return SyncUpSettingsImpl;
    }());
    SyncSettingsBuilder.SyncUpSettingsImpl = SyncUpSettingsImpl;
    /** Settings for syncing down (downloading) server data to a local data collection
     */
    var SyncDownSettingsImpl = /** @class */ (function () {
        function SyncDownSettingsImpl(syncDownFunc, toLocalObj) {
            this.syncDownFunc = syncDownFunc;
            this.toLocalObject = toLocalObj;
        }
        SyncDownSettingsImpl.copy = function (src) {
            return new SyncDownSettingsImpl(src.syncDownFunc, src.toLocalObject);
        };
        return SyncDownSettingsImpl;
    }());
    SyncSettingsBuilder.SyncDownSettingsImpl = SyncDownSettingsImpl;
})(SyncSettingsBuilder || (SyncSettingsBuilder = {}));
module.exports = SyncSettingsBuilder;

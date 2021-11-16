"use strict";
var Defer = require("ts-promises/Defer");
/** Combines functionality for two operations in one class:
 *  - Sync a local data collection to a remote data collection (refered to as 'syncing up').
 *  - Sync a remote data collection to a local data collection (refered to as 'syncing down').
 * The local and remote collections can have different data models (automatic conversion occurs using SyncSettingsWithUp.toSvcObject and SyncSettingsWithDown.toLocalObject).
 *
 * 'Syncing up' queries the local collection and send items with a 'isSynchedPropName' value of false to the remote collection.
 * 'Syncing down' retrieves items from the remote collection based on the 'params' parameter passed to the syncing down function and
 * then merges the remote data with the local data based on the SyncDownOp, primary keys, and 'lastModifiedPropName' timestamp values.
 *
 * There are a number of paradigms for merging data:
 * the entire collection can be cleared and refilled,
 * items can be merged by comparing local and remote primary keys,
 * or items can simple be added without any constraints.
 *
 * For a full list of actions, see the SyncDataCollection.SyncDownOp enum
 * @since 2016-1-29
 */
var SyncDataCollection = /** @class */ (function () {
    /** Create an object which can sync a data collection to/from a remote data destination/source
     * @param getLastSyncDownTimestamp a function to get a collection's last sync down timestamp (unix style millisecond number)
     * @param updateLastSyncDownTimestamp a function to update a collection's last sync down timestamp
     * @param isDeletedPropName the name of the property on both local and remote data models which contains the item's 'deleted' boolean flag
     * @param isSynchedPropName the name of the property on both local and remote data models which contains the item's 'synched' boolean flag
     * @param lastModifiedPropName the name of the property on both local and remote data models which contains the item's last-modified unix style millisecond timestamp number
     * @param [notifyActionStart] optional event listener type function which is called whenever a sync action starts, see {@link SyncAction}
     * @param [notifyActionEnd] optional event listener type function which is called whenever a sync action finishes, see {@link SyncAction}. Note: this method is only called if the action is successful, see 'notifyActionFailure'
     * @param [notifyActionFailure] optional event listener type function which is called whenever a sync action fails, see {@link SyncAction}
     */
    function SyncDataCollection(getLastSyncDownTimestamp, updateLastSyncDownTimestamp, isDeletedPropName, isSynchedPropName, lastModifiedPropName, notifyActionStart, notifyActionEnd, notifyActionFailure) {
        this.getLastSyncDownTimestamp = getLastSyncDownTimestamp;
        this.updateLastSyncDownTimestamp = updateLastSyncDownTimestamp;
        this.isDeletedPropName = isDeletedPropName;
        this.isSynchedPropName = isSynchedPropName;
        this.lastModifiedPropName = lastModifiedPropName;
        this.notifyActionStart = notifyActionStart;
        this.notifyActionEnd = notifyActionEnd;
        this.notifyActionFailure = notifyActionFailure;
    }
    /** Sync down a set of data collections
     * @template P the type of params to pass to each 'syncDownFunc' in the 'syncSettingsAry'
     * @template R the sync down error type
     * @param params: parameters to pass to the sync function
     * @param syncSettingsAry: an array of SyncSettings object to sync
     * @param syncDownOp the type of sync to perform
     * @return a map of 'syncSettingsAry' collection names to the promises that will complete when they finish syncing
     */
    SyncDataCollection.prototype.syncDownCollections = function (params, syncSettingsAry, syncDownOp) {
        var promises = {};
        // sync each of the tables based on the settings in the passed in array
        for (var i = 0, size = syncSettingsAry.length; i < size; i++) {
            var dataSetConfig = syncSettingsAry[i];
            // wrap the 'dataSetConfig' because function is called back async
            var addItemsFunc = SyncDataCollection.createAddUpdateOrRemoveItemsFunc(dataSetConfig, this.isDeletedPropName, syncDownOp);
            var syncTablePromise = this.syncDownCollection(params, dataSetConfig.localCollection, dataSetConfig.syncDownFunc, addItemsFunc);
            promises[dataSetConfig.localCollection.getName()] = syncTablePromise;
        }
        return promises;
    };
    /** Sync down data from a server to a single local data collection
     * @template E the local collection data model. This type should contain deleted, synched, and last modified properties corresponding to the prop names passed to the constructor
     * @template F the local collection data model with optional properties. This type should contain deleted, synched, and last modified properties corresponding to the prop names passed to the constructor
     * @template P the type of params to pass to the 'syncDownFunc'
     * @template S the remote data model. This type should contain deleted, synched, and last modified properties corresponding to the prop names passed to the constructor
     * @template R1 the sync down function error type
     * @template R2 the process results callback error type
     */
    SyncDataCollection.prototype.syncDownCollection = function (params, table, syncDownFunc, processResultsCallback) {
        var self = this;
        var dfd = Defer.newDefer();
        function syncFailure(err) {
            dfd.reject({
                collectionName: table.getName(),
                syncingDown: true,
                error: err,
            });
            if (self.notifyActionFailure) {
                if (!isAfterSync) {
                    self.notifyActionFailure("syncDown", table, syncDownTimer, err);
                }
                else {
                    self.notifyActionFailure("afterSyncDownUpdate", table, afterSyncDownUpdateTimer, err);
                }
            }
        }
        function saveData() {
            // update the last sync time for this table to right now
            try {
                self.updateLastSyncDownTimestamp(table);
                if (self.notifyActionEnd) {
                    self.notifyActionEnd("afterSyncDownUpdate", table, afterSyncDownUpdateTimer);
                }
            }
            catch (err) {
                syncFailure(err);
                return;
            }
            dfd.resolve(null);
        }
        try {
            var syncDownTimer = this.notifyActionStart ? this.notifyActionStart("syncDown", table) : null;
            var isAfterSync = false;
            var afterSyncDownUpdateTimer = null;
            syncDownFunc(params).then(function (items) {
                try {
                    if (self.notifyActionEnd) {
                        self.notifyActionEnd("syncDown", table, syncDownTimer);
                    }
                    isAfterSync = true;
                    afterSyncDownUpdateTimer = self.notifyActionStart ? self.notifyActionStart("afterSyncDownUpdate", table) : null;
                    var promise = processResultsCallback(items);
                    if (promise != null && promise["then"]) {
                        promise.then(saveData, syncFailure);
                    }
                    else {
                        saveData();
                    }
                }
                catch (err) {
                    syncFailure(err);
                }
            }).catch(syncFailure);
        }
        catch (err) {
            syncFailure(err);
        }
        return dfd.promise;
    };
    /** Using the URL, data collection, and other settings from 'syncSettings', synchronize data from a local data collection to a remove server
     * @template E the local collection data model. This type should contain deleted, synched, and last modified properties corresponding to the prop names passed to the constructor
     * @template F the local collection data model with optional properties. This type should contain deleted, synched, and last modified properties corresponding to the prop names passed to the constructor
     * @template P the type of params to pass to the 'syncSettings.syncUpFunc'
     * @template S the remote data model. This type should contain deleted, synched, and last modified properties corresponding to the prop names passed to the constructor
     * @template U the 'syncUpFunc' response
     * @template R the 'syncUpFunc' error
     * @param syncSetting: a sync settings objects containing the URL, data collection, and conversion functions needed to sync
     * only contains one record and send that one record as an object, rather than sending an
     * array of objects to the service call, false or undefined sends an array of any data in the collection
     */
    SyncDataCollection.prototype.syncUpCollection = function (params, syncSetting) {
        var self = this;
        var primaryKeys = syncSetting.primaryKeys;
        var primaryKey = (primaryKeys.length === 1 ? primaryKeys[0] : null);
        var primaryKeyCheckers = syncSetting.hasPrimaryKeyCheckers;
        var primaryKeyChecker = (primaryKeyCheckers.length === 1 ? primaryKeyCheckers[0] : null);
        var localColl = syncSetting.localCollection;
        function convertAndSendItemsToServer(items) {
            var beforeSyncUpPrepTimer = self.notifyActionStart ? self.notifyActionStart("beforeSyncUpPrep", localColl) : null;
            var toSvcObj = syncSetting.toSvcObject;
            var data = null;
            if (primaryKeyChecker != null) {
                data = SyncDataCollection.checkAndConvertSingleKeyItems(localColl.getName(), items, primaryKeyChecker, toSvcObj);
            }
            else {
                data = SyncDataCollection.checkAndConvertMultiKeyItems(localColl.getName(), items, primaryKeyCheckers, toSvcObj);
            }
            if (self.notifyActionEnd) {
                self.notifyActionEnd("beforeSyncUpPrep", localColl, beforeSyncUpPrepTimer);
            }
            var syncUpTimer = self.notifyActionStart ? self.notifyActionStart("syncUp", localColl) : null;
            return syncSetting.syncUpFunc(params, data).then(function (res) {
                if (self.notifyActionEnd) {
                    self.notifyActionEnd("syncUp", localColl, syncUpTimer);
                }
                return res;
            }).catch(function (err) {
                if (self.notifyActionFailure) {
                    self.notifyActionFailure("syncUp", localColl, syncUpTimer, err);
                }
                throw {
                    collectionName: localColl.getName(),
                    syncingUp: true,
                    error: err
                };
            });
        }
        return this.syncUpAndUpdateCollection(localColl, primaryKey, primaryKeys, convertAndSendItemsToServer);
    };
    SyncDataCollection.prototype.syncUpAndUpdateCollection = function (table, primaryKey, primaryKeys, syncAction) {
        var _a;
        var self = this;
        var dfd = Defer.newDefer();
        var synchedProp = {};
        synchedProp[this.isSynchedPropName] = false;
        var items = table.data(synchedProp);
        // if no items require syncing, resolve and return immediately
        if (items.length === 0 && ((_a = table.collection) === null || _a === void 0 ? void 0 : _a.dirty) !== true) {
            dfd.resolve(null);
            return dfd.promise;
        }
        syncAction(items).then(function (res) {
            var afterSyncUpUpdateTimer = self.notifyActionStart ? self.notifyActionStart("afterSyncUpUpdate", table) : null;
            if (primaryKey != null) {
                self.updateSinglePrimaryKeyItems(table, items, primaryKey);
            }
            else {
                self.updateMultiPrimaryKeyItems(table, items, primaryKeys);
            }
            if (self.notifyActionEnd) {
                self.notifyActionEnd("afterSyncUpUpdate", table, afterSyncUpUpdateTimer);
            }
            dfd.resolve(res);
        }).catch(function (err) {
            dfd.reject(err);
        });
        return dfd.promise;
    };
    /** Search for items in a table using multiple primary keys and 'isSynchedPropName' and use updateWhere(...) to update matching items
     */
    SyncDataCollection.prototype.updateMultiPrimaryKeyItems = function (table, items, primaryKeys) {
        // set each item's synched flag to true once the items have been synched with the server
        var synchedProp = {};
        synchedProp[this.isSynchedPropName] = true;
        var whereFilter = {};
        whereFilter[this.isSynchedPropName] = false;
        for (var k = 0, keyCount = primaryKeys.length; k < keyCount; k++) {
            whereFilter[primaryKeys[k]] = null;
        }
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            for (var k = 0, keyCount = primaryKeys.length; k < keyCount; k++) {
                whereFilter[primaryKeys[k]] = item[primaryKeys[k]];
            }
            table.updateWhere(whereFilter, synchedProp);
        }
    };
    /** Search for items in a table using a single primary key and 'isSynchedPropName' and use updateWhere(...) to update matching items
     */
    SyncDataCollection.prototype.updateSinglePrimaryKeyItems = function (table, items, primaryKey) {
        // set each item's synched flag to true once the items have been synched with the server
        var synchedProp = {};
        synchedProp[this.isSynchedPropName] = true;
        var whereFilter = {};
        whereFilter[this.isSynchedPropName] = false;
        whereFilter[primaryKey] = null;
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            whereFilter[primaryKey] = item[primaryKey];
            table.updateWhere(whereFilter, synchedProp);
        }
    };
    /** Create a function which removes items marked for deletion and add new items or update existing items depending on parameters.
     * @param syncSettings the sync down settings required to create a sync down items function
     * @param isDeletedPropName the name of the property which indicates if an item should be deleted, if value of this property is truthy the item is deleted when the syncing, nullable
     * @param syncDownOp the type of merge/update/add operation to perform with the new items
     */
    SyncDataCollection.createAddUpdateOrRemoveItemsFunc = function (syncSettings, isDeletedPropName, syncDownOp) {
        return function addUpdateOrRemoveItemsFunc(items) {
            var table = syncSettings.localCollection;
            var findFilterFunc = syncSettings.findFilterFunc;
            var toLocalObject = syncSettings.toLocalObject;
            if (syncDownOp.removeAll) {
                table.clearCollection();
            }
            if (items && items.length) {
                var removeDeletedData = syncDownOp.removeDeleted;
                // use DataCollection.addOrUpdateWhere(...) to update existing items
                if (syncDownOp.merge) {
                    for (var i = 0, size = items.length; i < size; i++) {
                        var item = items[i];
                        if (isDeletedPropName != null && item[isDeletedPropName]) {
                            if (removeDeletedData) {
                                var query = findFilterFunc(item);
                                table.removeWhere(query);
                            }
                        }
                        else {
                            var convertedItem = toLocalObject(item);
                            var query = findFilterFunc(item);
                            table.addOrUpdateWhereNoModify(query, convertedItem);
                        }
                    }
                }
                // use DataCollection.addAll(...) regardless of existing data
                else {
                    var res = [];
                    for (var i = 0, size = items.length; i < size; i++) {
                        var item = items[i];
                        if (isDeletedPropName != null && item[isDeletedPropName]) {
                            if (removeDeletedData) {
                                var query = findFilterFunc(item);
                                table.removeWhere(query);
                            }
                        }
                        else {
                            var convertedItem = toLocalObject(item);
                            res.push(convertedItem);
                        }
                    }
                    table.addAll(res);
                }
            }
        };
    };
    /** Check if each item in a list contains required primary keys, if not, throw an error.
     * Else convert the item using the provided conversion function
     * @return the 'items' array converted to result objects
     */
    SyncDataCollection.checkAndConvertMultiKeyItems = function (collName, items, hasPrimaryKeyFuncs, itemConverter) {
        var keyCount = hasPrimaryKeyFuncs.length;
        var resultItems = [];
        for (var i = 0, size = items.length; i < size; i++) {
            var item = items[i];
            var hasPrimaryKeys = true;
            for (var k = 0; k < keyCount; k++) {
                var hasPrimaryKey = hasPrimaryKeyFuncs[k](item);
                if (!hasPrimaryKey) {
                    hasPrimaryKeys = false;
                    break;
                }
            }
            if (hasPrimaryKeys) {
                resultItems.push(itemConverter(item));
            }
            else {
                throw new Error("Cannot syncing '" + collName + "' collection without primary keys");
            }
        }
        return resultItems;
    };
    /** Check if each item in a list contains a required primary key, if not, throw an error.
     * Else convert the item using the provided conversion function
     * @return the 'items' array converted to result objects
     */
    SyncDataCollection.checkAndConvertSingleKeyItems = function (collName, items, hasPrimaryKeyFunc, itemConverter) {
        var resultItems = [];
        for (var i = 0, size = items.length; i < size; i++) {
            var item = items[i];
            var hasPrimaryKey = hasPrimaryKeyFunc(item);
            if (hasPrimaryKey) {
                resultItems.push(itemConverter(item));
            }
            else {
                throw new Error("Cannot sync '" + collName + "' collection without primary keys");
            }
        }
        return resultItems;
    };
    return SyncDataCollection;
}());
(function (SyncDataCollection) {
    /** Definitions of how to sync down data and merge it with local data, currently includes:
     *  - REMOVE_DELETED_AND_MERGE_NEW
     *  - REMOVE_NONE_AND_MERGE_NEW
     *  - REMOVE_ALL_AND_ADD_NEW
     *  - REMOVE_DELETED_AND_ADD_NEW
     *  - REMOVE_NONE_AND_ADD_NEW
     */
    var SyncDownOp = /** @class */ (function () {
        function SyncDownOp(removeAll, removeDeleted, merge) {
            this.removeAll = removeAll;
            this.removeDeleted = removeDeleted;
            this.merge = merge;
        }
        /** if a remote item is synched down with a deleted prop of 'true' delete it from the local collection (based on primary key) and addOrUpdateWhere(...) all other items */
        SyncDownOp.REMOVE_DELETED_AND_MERGE_NEW = new SyncDownOp(false, true, true);
        /** use addOrUpdateWhere(...) to merge each remote synched down item into the local collection */
        SyncDownOp.REMOVE_NONE_AND_MERGE_NEW = new SyncDownOp(false, false, true);
        /** remove all existing local collection items before using addAll(...) to add the remote synched down items to the local collection */
        SyncDownOp.REMOVE_ALL_AND_ADD_NEW = new SyncDownOp(true, false, false);
        /** if a remote item is synched down with a deleted prop of 'true' delete it from the local collection (based on primary key) and add(...) all other items */
        SyncDownOp.REMOVE_DELETED_AND_ADD_NEW = new SyncDownOp(false, true, false);
        /** no constraints, use addAll(...) to add the remote synched down items to the local collection */
        SyncDownOp.REMOVE_NONE_AND_ADD_NEW = new SyncDownOp(false, false, false);
        return SyncDownOp;
    }());
    SyncDataCollection.SyncDownOp = SyncDownOp;
    /** A utility function for picking a 'SyncDownOp' based on a set of flags describing the desired syncing behavior
     * @param clearData true if all existing local data should be deleted before syncing down new data, false to keep local data (with some cavets)
     * @param removeDeletedData true to remove local data marked deleted (based 'isDeletedPropName' values of true) before syncing down new data, false to keep deleted data
     * @param mergeWithExistingData true to merge data items using 'findFilterFunc' and 'DataCollection.addOrUpdateWhereNoModify()' to generate queries and merge matching items, false to insert new items
     */
    function createSyncDownOp(clearData, removeDeletedData, mergeWithExistingData) {
        if (clearData) {
            return SyncDownOp.REMOVE_ALL_AND_ADD_NEW;
        }
        else {
            if (removeDeletedData) {
                return mergeWithExistingData ? SyncDownOp.REMOVE_DELETED_AND_MERGE_NEW : SyncDownOp.REMOVE_DELETED_AND_ADD_NEW;
            }
            else {
                return mergeWithExistingData ? SyncDownOp.REMOVE_NONE_AND_MERGE_NEW : SyncDownOp.REMOVE_NONE_AND_ADD_NEW;
            }
        }
    }
    SyncDataCollection.createSyncDownOp = createSyncDownOp;
})(SyncDataCollection || (SyncDataCollection = {}));
module.exports = SyncDataCollection;

lokijs-collections Syncing
==============

Sync [lokijs-collections](https://github.com/TeamworkGuy2/lokijs-collections) to or from a remote data source. lokijs-collections are TypeScript collection wrappers for [lokiJS](https://github.com/techfort/LokiJS). 
To use this library your lokijs-collections models need to have a deleted property/flag that is truthy/falsey, a modified property/flag that is truthy/falsey, a last modified timestamp property (unix style millisecond epoch timestamp).
See the lokijs-collections [README](https://github.com/TeamworkGuy2/lokijs-collections/blob/master/README.md) for further info on creating and using collections.

`sync/SyncSettingsBuilder` is used to create settings objects containing information and functions needed to sync a data collection.

`sync/SyncDataCollection` is used to upload a local in-memory data collection to a remote destination ('sync up') or download and integrate data from a remote data collection ('sync down').


Create a sync instance for a data collection:
```ts
var collection = /* ...a lokijs-collections instance */

var collSync = SyncSettingsBuilder.fromDataCollectionAndSyncFuncs(
		collection,
		function syncDown(params) { /* returns a promise */ },
		function syncUp(params, data) { /* returns a promise */ }
	)
	.addFilterFuncs(function findItem(item) { /* return a lokijs (mongoDB) style query object */ })
	.build();
```


Example 1: Configure and run a syncing:
```ts
// set of configuration flags for sync down actions, can be reused
var syncDownOp = SyncDataCollection.createSyncDownOp(
	false/* remove all existing data from collection */,
	true/* removed deleted entries */,
	true/* merge new entities with existing ones using the '.addFilterFuncs()' func to match entities */
);

// Create a sync instance which can be used to sync any collection sync instance up or down
var syncer = new SyncDataCollection(
	(coll) => /* e.g. tableSyncHistory.get(coll.getName()) */,
	(coll) => /* e.g. tableSyncHistory.save(coll.getName()) */,
	"Deleted", /* property name across all your data models used to indicate whether an entity is deleted */
	"Modified", /* property name across all your data models that indicates whether an entity has been modified since the last sync */
	"LastModified" /* property name across all your data models that last modified timestamps are stored in */
);

var collUpdater = SyncDataCollection.createAddUpdateOrRemoveItemsFunc(collSync, "Deleted", syncDownOp);

syncer.syncUpCollection({ /* sync down parameters */ }, collSync);

syncer.syncDownCollection({ /* sync down parameters */ }, collSync.localCollection, collSync.syncDownFunc, collUpdater).then(function () {
	/* done! */
}, function (err) {
	/* sync error */
});
```


Example 2: (low-level) Call sync functions manually, handle the results yourself:
```ts
collSync.syncUpFunc({ /* sync up parameters */ }, /* data, could be collection.data() */).then(function (results) {
	/* ... */
}, function (err) {
	/* ... */
});

collSync.syncDownFunc({ /* sync down parameters */ }).then(function (results) {
	/* ... */
}, function (err) {
	/* ... */
});
```

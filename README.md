lokijs-collections-syncing
==============

Sync [lokijs-collections](https://github.com/TeamworkGuy2/lokijs-collections) to or from a remote data source.
To use this library your `lokijs-collections` models need to have a deleted property/flag that is truthy/falsey, a modified property/flag that is truthy/falsey, a last modified timestamp property (unix style millisecond epoch timestamp).
See the lokijs-collections [README](https://github.com/TeamworkGuy2/lokijs-collections/blob/master/README.md) for more info on creating and using collections.

## Usage
This project is designed to be imported using commonJs require(...) calls. To use this in a web app, it's currently setup to be required and then included in a bundle at build time.

## Setup
`sync/SyncSettingsBuilder` is used to create settings objects containing information and functions needed to sync a data collection.

`sync/SyncDataCollection` is used to upload a local in-memory data collection to a remote destination ('sync up') or download and integrate data from a remote data collection ('sync down').


#### Create a sync instance for a data collection:
```ts
var SyncSettingsBuilder = require("lokijs-collections-syncing/sync/SyncSettingsBuilder");

var collection = /* a lokijs-collections collection instance */

var collSync = SyncSettingsBuilder.fromDataCollectionAndSyncFuncs(
		collection,
		function syncDown(params) { /* returns a promise */ },
		function syncUp(params, data) { /* returns a promise */ }
	)
	.addFilterFuncs(function findItem(item) { /* return a lokijs (mongoDB) style query object */ })
	.build();
```


### Example 1: Configure and run a sync:
```ts
var SyncDataCollection = require("lokijs-collections-syncing/sync/SyncDataCollection");

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
	"Deleted", /* property name in your data models that indicates whether an entity is deleted */
	"Modified", /* property name in your data models that indicates whether an entity has been modified since the last sync */
	"LastModified" /* property name in your data models that stores a last modified timestamps*/
);

var collUpdater = SyncDataCollection.createAddUpdateOrRemoveItemsFunc(collSync, "Deleted", syncDownOp);

syncer.syncUpCollection({ /* sync down parameters */ }, collSync);

syncer.syncDownCollection({ /* sync down parameters */ }, collSync.localCollection, collSync.syncDownFunc, collUpdater).then(function () {
	/* done! */
}, function (err) {
	/* sync error */
});
```


### Example 2: (low-level)
Call sync functions manually, handle the results yourself:

```ts
collSync.syncUpFunc({ /* sync up parameters */ }, /* data array such as collection.data() */).then(function (results) {
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

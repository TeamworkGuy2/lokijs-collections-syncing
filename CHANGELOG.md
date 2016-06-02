# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.1.0](N/A) - 2016-06-01
#### Added
* Moved 'sync/' directory from [lokijs-collections](https://github.com/TeamworkGuy2/lokijs-collections) to this library


========
## Original Change Logs Related to 'Syncing' from the [lokijs-collections](https://github.com/TeamworkGuy2/lokijs-collections) Library

> --------
> ### [0.12.5](https://github.com/TeamworkGuy2/lokijs-collections/commit/067fe49f6093a8738178da4ba271884aa701d4c3) - 2016-05-27
> #### Changed
> * More thorough error handling in SyncDataCollection.syncDownCollection()
> 
> #### Removed
> * Removed last modified timestamp filtering when updating local items after syncing up since primary key filtering should already restrict the search results sufficently
> 
> ...
> 
> --------
> ### [0.12.2](https://github.com/TeamworkGuy2/lokijs-collections/commit/03c4bb6bb3c9f517d1d97fd0a21750735564bcca) - 2016-05-25
> ...
> #### Fixed
> * Added 'syncingDown' error property to syncDownCollection() and changed 'syncDownFunc' type so sync functions don't have to return a SyncError
> 
> 
> --------
> ### [0.12.1](https://github.com/TeamworkGuy2/lokijs-collections/commit/898017578049040d57c28e22ce3b48ed270a3a43) - 2016-05-24
> ...
> #### Fixed
> * Fixed error in syncUpCollection() not rejecting promise correctly if sync function failed
> 
> ...
> 
> --------
> ### [0.8.1](https://github.com/TeamworkGuy2/lokijs-collections/commit/15f9c319ad19b138a45d30b720370c6c84210fba) - 2016-03-12
> #### Added
> * SyncDataCollection documention
> 
> #### Changed
> SyncSettingsBuilder (unifying function names):
> * Added fromDataCollectionAndSyncFuncs() 'findFilterFunc' parameter
> * Renamed setSettings() -> addSettingsInst()
> * Renamed setSyncDown() -> addSyncDownSettings()
> * Renamed setSyncUp() -> addSyncUpSettings()
> 
> 
> --------
> ### [0.8.0](https://github.com/TeamworkGuy2/lokijs-collections/commit/0e11c4e51b1af04ed8bd3bc84fd0abb4e2f418a4) - 2016-03-11
> #### Added
> 'Syncing' functionality - for asynchronously sending and receiving DataCollection data and merging it with an existing data collection
> * sync/SyncDataCollection.ts - with syncDownCollection() and syncUpCollection() functions as well as parameters to control how changes are synced, see:
>   * SyncDataCollection.SyncDownOp enum - which provides options for removing or preserving existing data during a sync and adding or merging new data
> * sync/SyncSettingsBuilder.ts - a someone complex Builder pattern class for building SyncSettings* interface instances
> * sync/syncing-types.d.ts - with all the new interfaces

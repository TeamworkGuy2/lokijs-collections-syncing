# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.3.0](N/A) - 2017-03-01
#### Changed
* Changed primary keys type from string to keyof
* Changed syncDownCollection(...) `S[]` type to `S` since it's only returned by the sync function and then passed to the callback


--------
### [0.2.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/c679e2a9d32e2bb848bd3ce879c241fe9a487e77) - 2016-10-22
#### Added
* Added 'hasPrimaryKeyCheckers' function array to SyncSettingsBuilder and interfaces to allow customization of primary key absense validation, default behavior is '!!item[primaryKey]' when validation functions are not provided
* Added notifyAction(Start|End|Failure) event listener functions to SyncDataCollection making it easy to add performance timers, error loggers, etc.


--------
### [0.1.3](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/de86ccaf95682361ff21759eadb39cb2c24c512e) - 2016-10-21
#### Changed
* Updated ts-promises dependency to latest version 0.2.0

#### Fixed
* Fixed a bug where promise was being rejecting and resolving when an error occurred


--------
### [0.1.2](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/62275392a12e8b1251930c98d021730955d8a675) - 2016-09-19
#### Changed
* Updated ts-mortar dependency to latest version 0.11.0
* Updated lokijs-collections dependency to latest version 0.14.0


--------
### [0.1.1](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/879bf2b2e37f3c25671c19302a37722fff231dd1) - 2016-09-02
#### Changed
* Renamed project from lokijs-collections-sync -> lokijs-collections-syncing


--------
### [0.1.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/fb777d373a2079e995255a06cfdca8082f8a7389) - 2016-06-01
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

# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.15.0](N/A) - 2022-02-21
#### Changed
* Update `lokijs-collections` dependency from `0.31.*` to `0.32.*`


--------
### [0.14.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/0cccf69f66d8e20be78a7766f913898c7b3a8716) - 2022-01-02
#### Changed
* Update to TypeScript 4.4


--------
### [0.13.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/d9e8ec8d9b7c21dede62ade4841bc79e241b6040) - 2021-11-15
#### Fixed
* `SyncDataCollection.syncUpAndUpdateCollection()` only skips calling back the `syncAction` if there are no items to sync AND the collection is NOT dirty


--------
### [0.12.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/2777fdcdf8c3c374403767caff02d482174f7bd8) - 2020-10-01
#### Changed
* Update `lokijs-collections` dependency from `0.29.*` to `0.30.*`


--------
### [0.11.2](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/1901211b11eb9d4f5285834af4a9dce0ede6e656) - 2021-08-30
#### Fixed
* Fix an issue with this package being used by a project that does not have tsconfig 'strict' enabled


--------
### [0.11.1](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/98f0758973ebd74f4cf918c3e17792cd980f7871) - 2021-08-06
#### Changed
* Export all `SyncSettingsBuilder` interfaces


--------
### [0.11.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/4343fa18f68d09c2b43745bfd3723eaa1c099683) - 2021-06-12
#### Changed
* Update to TypeScript 4.3


--------
### [0.10.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/99134a2b9187bbc71c7709c46dcc0b7a8818a0dd) - 2021-03-16
#### Changed
* Update dependencies for `Q` removal


--------
### [0.9.1](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/86c105632f25c0b6cf7cc704f88bbf21a75f627b) - 2020-12-11
#### Changed
* Improve `SyncDataCollection.syncUpAndUpdateCollection()` type signature to support either null `primaryKey` or null `primaryKeys` but not both


--------
### [0.9.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/6ab12c05a18606eaa5c6ba1ce4fd1f89dcd73b63) - 2020-09-05
#### Changed
* Update to TypeScript 4.0


--------
### [0.8.1](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/4ab2b8ea48a7740c64f3d1e4375a5aaedd0734c5) - 2020-08-12
#### Changed
* Update `lokijs-collections` dependency from github URL to new npm version number


--------
### [0.8.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/7c4cac2c647bb8cf5d46d87c881046bfb26eb814) - 2019-11-09
#### Changed
* Renamed interfaces:
  * `SyncSettingsWithUp` -> `SyncSettingsUp`
  * `SyncSettingsWithDown` -> `SyncSettingsDown`
  * `SyncSettingsWithUpDown` -> `SyncSettingsUpDown`

#### Removed
* Remove unused `updateLastSyncDate` field from `SyncDownSettingsImpl`
* Remove unnecessary `F` generic type from `SyncUpSettings`, `SyncDownSettings`, `SyncUpSettingsImpl`, and `SyncDownSettingsImpl`
* Remove unused `P` and `R` generic parameters from `SyncDataCollection.createAddUpdateOrRemoveItemsFunc()`


--------
### [0.7.10](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/744380abc048fbe6f9acde6bd3ab419d51fc2e8e) - 2019-11-08
#### Changed
* Update to TypeScript 3.7


--------
### [0.7.9](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/a1e37a078a10b7435d43323946d3d81f490d07e9) - 2019-06-18
#### Changed
* Update dependency `lokijs-collections@0.25.1` for persister fixes


--------
### [0.7.8](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/01bd9a3815059956634298e6a02895a8b7b07cce) - 2019-06-18
#### Changed
* Update to TypeScript 3.5
* Update dependency `lokijs-collections@0.25.0` for major refactor, alpha IndexedDbPersister support, and `ts-mortar@0.18.0`


--------
### [0.7.7](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/aa7f17742c8143350d4bbf560025b35ccd1dabc8) - 2019-03-21
#### Changed
* Update dependency `lokijs-collections@0.24.7` for `@twg2/ts-twg-ast-codegen` path fix


--------
### [0.7.6](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/0cc64d783faa828b3f423826153c683fe4c81d18) - 2019-03-20
#### Changed
* Switch `ts-promises` dependency from github to npm and to `lokijs-collections@0.24.5`


--------
### [0.7.5](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/97f61b0c15f2a245e425b4df7c578c4e6e463792) - 2019-03-14
#### Changed
* Update dependency `lokijs-collections@0.24.5` for `ts-mortar@0.16.0` update (fix for `Strings.isDigit()`, removal of `Objects.getProps()` and `Strings.endsWith()`, and several other changes)


--------
### [0.7.4](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/0e1eac2cfc55d6c358070360997ec901a035cd20) - 2018-12-29
#### Changed
* Update `lokijs-collections` dependency


--------
### [0.7.3](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/e9a02b2794acf28a5c7d5d6598274970128cc40e) - 2018-12-29
#### Changed
* Update to TypeScript 3.2
* Update dev and @types/ dependencies
* Update README.md - usage note and clarified examples
* Remove `tsconfig.json lib "dom"`


--------
### [0.7.2](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/63f1bb5224bcc07bc7d2f1cf64d2fc8d356183d2) - 2018-11-23
#### Changed
* Update dependency `ts-promises@0.4.4` (PsPromise.then() type improvement) and `lokijs-collections@0.24.2` (update to ts-mortar@0.15.9)
* Remove dependency `ts-mortar` since it is indirectly available via `lokijs-collections` dependency
* Simplify some `SyncDataCollection` logic which didn't need to use ts-mortar `Arrays`
* Minor README.md update


--------
### [0.7.1](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/7747c9bf974b1530536f5550c253adcf9c2686e1) - 2018-10-20
#### Changed
* Switch `package.json` github dependencies from tag urls to release tarballs to simplify npm install (doesn't require git to npm install tarballs)


--------
### [0.7.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/89f44cad125b4a4327e737be9226aeb7d20cb4c5) - 2018-10-17
#### Changed
* Update to TypeScript 3.1
* Update dev dependencies and @types
* Enable `tsconfig.json` `strict` and fix compile errors
* Removed compiled bin tarball in favor of git tags
* Update `primaryKeys` parameters in SyncSettingsBuilder functions from `(keyof T) | (keyof T)[]` to `(keyof T & string)[]` to simplify and compile without error


--------
### [0.6.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/bc9dec000cb93104d2ba6f173e462b2db1a36eac) - 2018-04-14
#### Changed
* Update to TypeScript 2.8
* Setup dependencies as proper npm node_modules
* Update tsconfig.json with `noImplicitReturns: true` and `forceConsistentCasingInFileNames: true`
* Added release tarball and npm script `build-package` to package.json referencing external process to generate tarball


--------
### [0.5.2](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/4790feb1cf7d7c8df4c1fe9c84731dfc9d7d8bb3) - 2018-02-28
#### Changed
* Update to TypeScript 2.7
* Update dependencies: mocha, @types/chai, @types/mocha, @types/node
* Enable tsconfig.json `noImplicitAny`


--------
### [0.5.1](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/b09fba823a4295cd1beab93aa22931e71afdcd0e) - 2017-11-16
#### Changed
* `tsconfig.json` set `strictNullChecks` to `true` (incorrect in previous commit). Updated some dependency versions.
* Renamed some parameters and local variables


--------
### [0.5.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/2aea2c6d425e925817f22dd8d2535978272800ea) - 2017-11-06
#### Changed
* `tsconfig.json` added `strictNullChecks` and updated code to handle nulls
* Update dependency `lokijs-collections@0.22.0` (major refactor and 'strictNullChecks')
  * Renamed `convertToLocalObjectFunc` -> `toLocalObject` and `convertToSvcObjectFunc` -> `toSvcObject`


--------
### [0.4.2](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/305628af1eafdcffa0bb3181a19bfdaa9a90ccb4) - 2017-09-10
#### Changed
* `tsconfig.json` added `noImplicitThis: true`
* Added README example


--------
### [0.4.1](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/5822545bf8330b4fc57005e7b060eed2603e12e3) - 2017-08-05
#### Changed
* Update to TypeScript 2.4


--------
### [0.4.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/85b3decd27b0febf8a08a0ab6c376411c3a97eb4) - 2017-05-19
#### Changed
* Updated types to match lokijs-collections@0.19.1


--------
### [0.3.1](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/da47005500dca7b73d28c109ffc6336104002962) - 2017-05-09
#### Changed
* Updated to TypeScript 2.3, added tsconfig.json, use @types/ definitions
* Updated documentation to work better with Visual Studio


--------
### [0.3.0](https://github.com/TeamworkGuy2/lokijs-collections-syncing/commit/bbbc22797eaf4663cbc0c9b5105a8a5e8fe06e15) - 2017-03-01
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

﻿/// <reference path="../../lokijs-collections/db-collections/in-mem-collections.d.ts" />

/** Interfaces for syncing data collections to and from a server
 * @author TeamworkGuy2
 * @since 2016-3-6
 */

/** A collection sync error, containing a collection name, an error, and flags indicating what type of sync call failed
 */
declare interface SyncError {
    collectionName: string;
    syncingUp?: boolean;
    syncingDown?: boolean;
    error: any;
}


/** Settings for syncing server data to and from a local data collection
 */
declare interface SyncSettings<E, F, S, R> {
    localCollection: DataCollection<E, F>;
    primaryKeys: (keyof E)[];
    hasPrimaryKeyCheckers: ((obj: E) => boolean)[];
    findFilterFunc: (item: S) => F;
    copyObjectFunc: (item: E) => E;
    convertUrlToSyncDownFunc?: (url: string) => (params: any) => PsPromise<S[], R>;
    convertUrlToSyncUpFunc?: (url: string) => (params: any, items: S[]) => PsPromise<any, R>;
}


/** Settings for syncing up (uploading) server data from a local data collection
 * @template E the client data collection type
 * @template F the client data collection type with optional properties
 * @template P the parameters to pass with the items
 * @template S the server data collection type
 * @template U the server response
 * @template R the server error
 */
declare interface SyncUpSettings<E, F, P, S, U, R> {
    syncUpFunc: (params: P, items: S[]) => PsPromise<U, R>;
    convertToSvcObjectFunc: (item: E) => S;
}


/** Settings for syncing down (downloading) server data to a local data collection
 * @template F the client data collection type with optional properties
 * @template P the parameters to pass with the items
 * @template S the server data collection type
 * @template R the server error
 * @template E the client data collection type
 */
declare interface SyncDownSettings<E, F, P, S, R> {
    syncDownFunc: (params: P) => PsPromise<S[], R>;
    convertToLocalObjectFunc: (item: S) => E;
}


declare interface SyncSettingsWithUp<E, F, P, S, U, R> extends SyncSettings<E, F, S, R>, SyncUpSettings<E, F, P, S, U, R> {
}


declare interface SyncSettingsWithDown<E, F, P, S, R> extends SyncSettings<E, F, S, R>, SyncDownSettings<E, F, P, S, R> {
}


declare interface SyncSettingsWithUpDown<E, F, P, S, U, R> extends SyncSettings<E, F, S, R>, SyncUpSettings<E, F, P, S, U, R>, SyncDownSettings<E, F, P, S, R> {
}

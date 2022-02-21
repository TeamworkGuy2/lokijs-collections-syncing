import Arrays = require("ts-mortar/utils/Arrays");

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
class SyncSettingsBuilder<E extends F, F, P, S, U, R> implements SyncSettingsBuilder.SettingsBuilder<E, F> {
    // sync settings
    localCollection!: DataCollection<E, F>;
    primaryKeys!: (keyof E & string)[];
    hasPrimaryKeyCheckers!: ((obj: E) => boolean)[];
    findFilterFunc!: (item: S) => F;
    copyObjectFunc!: (item: E) => E;
    convertUrlToSyncDownFunc!: (url: string) => (params: any) => PsPromise<S[], R>;
    convertUrlToSyncUpFunc!: (url: string) => (params: P, items: S[]) => PsPromise<U, R>;
    // sync down
    syncDownFunc!: (params: P) => PsPromise<S[], R>;
    toLocalObject!: (item: S) => E;
    // sync up
    syncUpFunc!: (params: P, items: S[]) => PsPromise<U, R>;
    toSvcObject!: (item: E) => S;


    constructor() {
    }


    public addSettings(
        localCollection: DataCollection<E, F>,
        primaryKeys: (keyof E & string)[],
        hasPrimaryKeyCheckers: ((obj: E) => boolean) | ((obj: E) => boolean)[],
        findFilterFunc: (item: any) => any,
        copyObjectFunc: (item: E) => E
    ) {
        this.localCollection = localCollection;
        this.primaryKeys = primaryKeys;
        this.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
        this.findFilterFunc = findFilterFunc;
        this.copyObjectFunc = copyObjectFunc;
        return this;
    }


    public addSyncDownUrl<P1, S1, R1>(syncDownUrl: string, toLocalObject: (item: any) => E): SyncSettingsBuilder<E, F, P1, S1, U, R1> {
        this.syncDownFunc = this.convertUrlToSyncDownFunc(syncDownUrl);
        this.toLocalObject = toLocalObject;
        return <any>this;
    }


    public addSyncDownFunc<P1, S1, R1>(syncDownFunc: (params: P1) => PsPromise<S1[], R1>, toLocalObject: (item: any) => E): SyncSettingsBuilder<E, F, P1, S1, U, R1> {
        this.syncDownFunc = <any>syncDownFunc;
        this.toLocalObject = toLocalObject;
        return <any>this;
    }


    public addSyncUpUrl<P1, S1, R1>(syncUpUrl: string, toSvcObject: (item: E) => any): SyncSettingsBuilder<E, F, P1, S1, U, R1> {
        this.syncUpFunc = this.convertUrlToSyncUpFunc(syncUpUrl);
        this.toSvcObject = toSvcObject;
        return <any>this;
    }


    public addSyncUpFunc<P1, S1, U1, R1>(syncUpFunc: (params: P1, items: S1[]) => PsPromise<U1, R1>, toSvcObject: (item: E) => any): SyncSettingsBuilder<E, F, P1, S1, U1, R1> {
        this.syncUpFunc = <any>syncUpFunc;
        this.toSvcObject = toSvcObject;
        return <any>this;
    }


    public build(): SyncSettingsUpDown<E, F, P, S, U, R> {
        return this;
    }


    public static copy<E1 extends F1, F1, P1, S1, U1, R1>(src: SyncSettingsBuilder<E1, F1, P1, S1, U1, R1>, deepCopy: boolean = true) {
        if (deepCopy) {
            return new SyncSettingsBuilder<E1, F1, P1, S1, U1, R1>().addSettings(src.localCollection, src.primaryKeys, src.hasPrimaryKeyCheckers, src.findFilterFunc, src.copyObjectFunc)
                .addSyncDownFunc(src.syncDownFunc, src.toLocalObject)
                .addSyncUpFunc(src.syncUpFunc, src.toSvcObject);
        }
        return new SyncSettingsBuilder<E1, F1, P1, S1, U1, R1>().addSettings(src.localCollection, src.primaryKeys, src.hasPrimaryKeyCheckers, src.findFilterFunc, src.copyObjectFunc)
            .addSyncDownFunc(src.syncDownFunc, src.toLocalObject)
            .addSyncUpFunc(src.syncUpFunc, src.toSvcObject);
    }


    public static fromSettingsConvert<E extends F, F, R>(
        localCollection: DataCollection<E, F>,
        primaryKeys: (keyof E & string)[],
        hasPrimaryKeyCheckers: ((obj: E) => boolean) | ((obj: E) => boolean)[],
        findFilterFunc: (item: any) => any,
        copyObjectFunc: (item: E) => E,
        convertUrlToSyncDownFunc: (url: string) => (params: any) => PsPromise<any[], R>,
        convertUrlToSyncUpFunc: (url: string) => (params: any, items: any[]) => PsPromise<any, R>
    ): SyncSettingsBuilder.SyncDownBuilderWithUrl<E, F> & SyncSettingsBuilder.SyncUpBuilderWithUrl<E, F> {

        var inst = new SyncSettingsBuilder<E, F, any, any, any, R>();
        inst.localCollection = localCollection;
        inst.primaryKeys = primaryKeys;
        inst.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
        inst.findFilterFunc = findFilterFunc;
        inst.copyObjectFunc = copyObjectFunc;
        inst.convertUrlToSyncDownFunc = convertUrlToSyncDownFunc;
        inst.convertUrlToSyncUpFunc = convertUrlToSyncUpFunc;
        return inst;
    }


    public static fromSettings<E extends F, F, R>(
        localCollection: DataCollection<E, F>,
        primaryKeys: (keyof E & string)[],
        hasPrimaryKeyCheckers: ((obj: E) => boolean) | ((obj: E) => boolean)[],
        findFilterFunc: (item: any) => any,
        copyObjectFunc: (item: E) => E
    ): SyncSettingsBuilder.SyncDownBuilder<E, F> & SyncSettingsBuilder.SyncUpBuilder<E, F> {

        var inst = new SyncSettingsBuilder<E, F, any, any, any, R>();
        inst.localCollection = localCollection;
        inst.primaryKeys = primaryKeys;
        inst.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
        inst.findFilterFunc = findFilterFunc;
        inst.copyObjectFunc = copyObjectFunc;
        return inst;
    }


    public static fromSettingsObj<E extends F, F, S, R>(settings: SyncSettings<E, F, S, R>): SyncSettingsBuilder.SyncDownBuilder<E, F> & SyncSettingsBuilder.SyncUpBuilder<E, F> {
        var inst = new SyncSettingsBuilder<E, F, S, any, any, R>();
        inst.localCollection = settings.localCollection;
        inst.primaryKeys = settings.primaryKeys;
        inst.hasPrimaryKeyCheckers = settings.hasPrimaryKeyCheckers;
        inst.findFilterFunc = settings.findFilterFunc;
        inst.copyObjectFunc = settings.copyObjectFunc;
        return inst;
    }


    public static fromDataCollectionAndSyncFuncs<E extends F, F, P, S, U, R>(
        localCollection: DataCollection<E, F>,
        syncDownFunc: (params: P) => PsPromise<S[], R>,
        syncUpFunc: (params: P, items: S[]) => PsPromise<U, R>
    ): { addFilterFuncs: (findFilterFunc: (item: S) => F) => SyncSettingsBuilder.BuilderEnd<E, F, P, S, U, R> } {

        var collModel = localCollection.getDataModel();
        var collFuncs = localCollection.getDataModelFuncs();
        var inst = new SyncSettingsBuilder<E, F, P, S, U, R>();
        // sync settings
        inst.localCollection = localCollection;
        inst.primaryKeys = collModel.primaryKeys;
        inst.hasPrimaryKeyCheckers = collModel.primaryKeys.map(k => (itm: E) => !!itm[k]);
        inst.copyObjectFunc = collFuncs.copyFunc;
        // sync down
        inst.syncDownFunc = syncDownFunc;
        inst.toLocalObject = collFuncs.toLocalObject!;
        // sync up
        inst.syncUpFunc = syncUpFunc;
        inst.toSvcObject = collFuncs.toSvcObject!;

        return {
            addFilterFuncs: function (findFilterFunc: (item: S) => F) {
                inst.findFilterFunc = findFilterFunc;
                return inst;
            }
        };
    }

}

module SyncSettingsBuilder {

    /** SyncSettings class
     * Settings for syncing server data to and from a local data collection
     */
    export class SyncSettingsImpl<E extends F, F, S, R> implements SyncSettings<E, F, S, R> {
        localCollection: DataCollection<E, F>;
        primaryKeys: (keyof E & string)[];
        hasPrimaryKeyCheckers: ((obj: E) => boolean)[];
        findFilterFunc: (item: S) => F;
        copyObjectFunc: (item: E) => E;
        convertUrlToSyncDownFunc: ((url: string) => (params: any) => PsPromise<any[], R>) | undefined;
        convertUrlToSyncUpFunc: ((url: string) => (params: any, items: any[]) => PsPromise<any, R>) | undefined;


        constructor(
            localCollection: DataCollection<E, F>,
            primaryKeys: (keyof E & string)[],
            hasPrimaryKeyCheckers: ((obj: E) => boolean) | ((obj: E) => boolean)[],
            findFilterFunc: (item: S) => F,
            copyObj: (item: E) => E,
            convertUrlToSyncDownFunc?: (url: string) => (params: any) => PsPromise<any[], R>,
            convertUrlToSyncUpFunc?: (url: string) => (params: any, items: any[]) => PsPromise<any, R>
        ) {
            this.localCollection = localCollection;
            this.primaryKeys = primaryKeys;
            this.hasPrimaryKeyCheckers = Arrays.asArray(hasPrimaryKeyCheckers);
            this.findFilterFunc = findFilterFunc;
            this.copyObjectFunc = copyObj;
            this.convertUrlToSyncDownFunc = convertUrlToSyncDownFunc;
            this.convertUrlToSyncUpFunc = convertUrlToSyncUpFunc;
        }


        public static copy<E1 extends F1, F1, S1, R1>(src: SyncSettings<E1, F1, S1, R1>) {
            return new SyncSettingsImpl(src.localCollection, src.primaryKeys, src.hasPrimaryKeyCheckers, src.findFilterFunc, src.copyObjectFunc, src.convertUrlToSyncDownFunc, src.convertUrlToSyncUpFunc);
        }

    }




    /** Settings for syncing up (uploading) server data from a local data collection
     */
    export class SyncUpSettingsImpl<E, P, S, U, R> implements SyncUpSettings<E, P, S, U, R> {
        syncUpFunc: (params: P, items: S[]) => PsPromise<U, R>;
        toSvcObject: (item: E) => S;


        constructor(syncUpFunc: (params: P, items: S[]) => PsPromise<U, R>, toSvcObj: (item: E) => S) {
            this.syncUpFunc = syncUpFunc;
            this.toSvcObject = toSvcObj;
        }


        public static copy<E1, P1, S1, U1, R1>(src: SyncUpSettings<E1, P1, S1, U1, R1>) {
            return new SyncUpSettingsImpl(src.syncUpFunc, src.toSvcObject);
        }

    }




    /** Settings for syncing down (downloading) server data to a local data collection
     */
    export class SyncDownSettingsImpl<E, P, S, R> implements SyncDownSettings<E, P, S, R> {
        syncDownFunc: (params: P) => PsPromise<S[], R>;
        toLocalObject: (item: any) => E;


        constructor(syncDownFunc: (params: P) => PsPromise<S[], R>, toLocalObj: (item: any) => E) {
            this.syncDownFunc = syncDownFunc;
            this.toLocalObject = toLocalObj;
        }


        public static copy<E1, P1, S1, R1>(src: SyncDownSettings<E1, P1, S1, R1>) {
            return new SyncDownSettingsImpl(src.syncDownFunc, src.toLocalObject);
        }

    }


    // ==== interfaces for building sync settings ====
    export interface SettingsBuilder<E extends F, F> {
        addSettings<S>(
            localCollection: DataCollection<E, F>,
            primaryKeys: string | string[],
            hasPrimaryKeyCheckers: ((obj: E) => boolean) | ((obj: E) => boolean)[],
            findFilterFunc: (item: S) => F,
            copyObjectFunc: (item: E) => E
        ): SyncDownBuilder<E, F> & SyncUpBuilder<E, F>;
    }

    export interface SyncDownBuilder<E extends F, F> {
        addSyncDownFunc<P, S, R>(syncDownFunc: (params: P) => PsPromise<S[], R>, toLocalObject: (item: S) => E): SyncDownAlreadyUpBuilder<E, F, P, S, R>;
    }

    export interface SyncDownBuilderWithUrl<E extends F, F> extends SyncDownBuilder<E, F> {
        addSyncDownUrl<P, S, R>(syncDownUrl: string, toLocalObject: (item: S) => E): SyncDownAlreadyUpBuilderWithUrl<E, F, P, S, R>;
    }

    export interface SyncUpBuilder<E extends F, F> {
        addSyncUpFunc<P, S, U, R>(syncUpFunc: (params: P, items: S[]) => PsPromise<U, R>, toSvcObject: (item: E) => S): SyncUpAlreadyDownBuilder<E, F, P, S, U, R>;
    }

    export interface SyncUpBuilderWithUrl<E extends F, F> extends SyncUpBuilder<E, F> {
        addSyncUpUrl<P, S, U, R>(syncUpUrl: string, toSvcObject: (item: E) => S): SyncUpAlreadyDownBuilderWithUrl<E, F, P, S, U, R>;
    }

    export interface SyncUpAlreadyDownBuilder<E extends F, F, P, S, U, R> {
        addSyncDownFunc(syncDownFunc: (params: P) => PsPromise<S[], R>, toLocalObject: (item: S) => E): BuilderEnd<E, F, P, S, U, R>;
        build(): SyncSettingsUp<E, F, P, S, U, R>;
    }

    export interface SyncUpAlreadyDownBuilderWithUrl<E extends F, F, P, S, U, R> extends SyncUpAlreadyDownBuilder<E, F, P, S, U, R> {
        addSyncDownUrl(syncDownUrl: string, toLocalObject: (item: S) => E): BuilderEnd<E, F, P, S, U, R>;
    }

    export interface SyncDownAlreadyUpBuilder<E extends F, F, P, S, R> {
        addSyncUpFunc<U>(syncUpFunc: (params: P, items: S[]) => PsPromise<U, R>, toSvcObject: (item: E) => S): BuilderEnd<E, F, P, S, U, R>;
        build(): SyncSettingsDown<E, F, P, S, R>;
    }

    export interface SyncDownAlreadyUpBuilderWithUrl<E extends F, F, P, S, R> extends SyncDownAlreadyUpBuilder<E, F, P, S, R> {
        addSyncUpUrl<U>(syncUpUrl: string, toSvcObject: (item: E) => S): BuilderEnd<E, F, P, S, U, R>;
    }

    export interface BuilderEnd<E extends F, F, P, S, U, R> extends SettingsBuilder<E, F>, SyncDownBuilder<E, F>, SyncUpBuilder<E, F> {
        build(): SyncSettingsUpDown<E, F, P, S, U, R>;
    }

}

export = SyncSettingsBuilder;
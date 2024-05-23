import { BrowserDataObject } from "../models/browser-data-object.model";

export interface LocalStorageVersionInterface {
    read: (data: any) => BrowserDataObject;
    setup: () => BrowserDataObject;
    getExportableData: (data: BrowserDataObject) => any;
    isMatch: (version: string) => boolean;
}

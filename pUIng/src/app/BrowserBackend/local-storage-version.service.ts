import { Injectable } from '@angular/core';
import { BrowserDataObject } from '../models/browser-data-object.model';
import { LocalStorageVersionInterface } from './local-storage-version-interface';
import { Version000000Lite } from './Versions/version000000-lite';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageVersionService {

  versions: LocalStorageVersionInterface[];

  constructor() {
    this.versions = [
      new Version000000Lite(),
    ];
  }

  read(data: any): BrowserDataObject {
    var versionString = data.lsVersion;
    var version = this.getVersionFromString(versionString);
    return version.read(data);
  }

  getVersionFromString(version: string): LocalStorageVersionInterface {
    var index = this.versions.findIndex(x => x.isMatch(version));
    if (index == -1) {
      throw Error("unrecognized Version"+version, );
    } else {
      return this.versions[index];
    }
  }

  getLatestVersion(): LocalStorageVersionInterface {
    return this.versions[this.versions.length-1];
  }
}

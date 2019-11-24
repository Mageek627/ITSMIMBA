import { Plugins } from '@capacitor/core';

export class StorageUtils {
  static set(key: string, value: any) {
    return Plugins.Storage.set({
      key,
      value: String(value)
    });
  }
  static get(key: string) {
    return Plugins.Storage.get({ key }).then(x => x.value);
  }
  static setJSON(key: string, value: any) {
    return Plugins.Storage.set({
      key,
      value: JSON.stringify(value)
    });
  }
  static getJSON(key: string) {
    return Plugins.Storage.get({ key }).then(x => JSON.parse(x.value));
  }
}

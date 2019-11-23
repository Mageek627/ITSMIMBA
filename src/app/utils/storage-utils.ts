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
}

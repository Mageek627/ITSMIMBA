import { Plugins } from '@capacitor/core';
import 'capacitor-secure-storage-plugin';

export class StorageUtils {
  static set(key: string, value: any): Promise<boolean> {
    return Plugins.SecureStoragePlugin.set({
      key,
      value: String(value)
    });
  }
  static get(key: string): Promise<string> {
    // See https://github.com/martinkasa/capacitor-secure-storage-plugin/issues/2
    return Plugins.SecureStoragePlugin.get({ key })
      .then((x: { value: string }) =>
        x.value !== null && x.value !== atob(null) ? x.value : null
      )
      .catch(() => null);
  }
  static setJSON(key: string, value: any): Promise<boolean> {
    return this.set(key, JSON.stringify(value));
  }
  static getJSON(key: string): Promise<any> {
    return this.get(key)
      .then(value => JSON.parse(value))
      .catch(() => null);
  }
}

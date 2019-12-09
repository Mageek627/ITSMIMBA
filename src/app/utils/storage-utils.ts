import { Plugins } from '@capacitor/core';
import 'capacitor-secure-storage-plugin';

export class StorageUtils {
  static set(key: string, value: any) {
    return Plugins.SecureStoragePlugin.set({
      key,
      value: String(value)
    });
  }
  static get(key: string) {
    return Plugins.SecureStoragePlugin.get({ key }).then(
      (x: { value: string }) => x.value
    );
  }
  static setJSON(key: string, value: any) {
    return Plugins.SecureStoragePlugin.set({
      key,
      value: JSON.stringify(value)
    });
  }
  static getJSON(key: string) {
    return Plugins.SecureStoragePlugin.get({
      key
    }).then((x: { value: string }) => JSON.parse(x.value));
  }
}

import { Plugins } from '@capacitor/core';
import 'capacitor-secure-storage-plugin';

export class StorageUtils {
  // public static set(key: string, value: any): Promise<boolean> {
  //   LogUtils.log(String(value));
  //   return Plugins.SecureStoragePlugin.set({
  //     key,
  //     value: String(value)
  //   })
  //     .then((x: { value: string }) => x.value)
  //     .catch(e => {
  //       LogUtils.error(e);
  //       return false;
  //     });
  // }
  // public static get(key: string): Promise<string> {
  //   // See https://github.com/martinkasa/capacitor-secure-storage-plugin/issues/2
  //   return Plugins.SecureStoragePlugin.get({ key })
  //     .then((x: { value: string }) => {
  //       LogUtils.log('here is');
  //       LogUtils.log(x.value);
  //       return x.value !== null && x.value !== atob(null) ? x.value : null;
  //     })
  //     .catch(e => {
  //       LogUtils.error(e);
  //       return null;
  //     });
  // }
  // public static setJSON(key: string, value: any): Promise<boolean> {
  //   return this.set(key, JSON.stringify(value));
  // }
  // public static getJSON(key: string): Promise<any> {
  //   return this.get(key)
  //     .then(value => JSON.parse(value))
  //     .catch(() => null);
  // }

  // TODO:
  // WHEN SECURE STORAGE DOESN'T HAVE MAJOR BUGS ANYMORE
  // See https://github.com/martinkasa/capacitor-secure-storage-plugin/issues/8
  // Then there will be a difference between get and getUnsafe

  public static set(key: string, value: any): Promise<void> {
    return Plugins.Storage.set({
      key,
      value: String(value)
    });
  }
  public static get(key: string): Promise<string> {
    return Plugins.Storage.get({ key })
      .then((x: { value: string }) => x.value)
      .catch(() => null);
  }
  public static setJSON(key: string, value: any): Promise<void> {
    return this.set(key, JSON.stringify(value));
  }
  public static getJSON(key: string): Promise<any> {
    return this.get(key)
      .then(value => JSON.parse(value))
      .catch(() => null);
  }
  public static async clear(): Promise<void> {
    await Plugins.SecureStoragePlugin.clear();
    await Plugins.Storage.clear();
    return;
  }
  public static setUnsafe(key: string, value: any): Promise<void> {
    return Plugins.Storage.set({
      key,
      value: String(value)
    });
  }
  public static getUnsafe(key: string): Promise<string> {
    return Plugins.Storage.get({ key })
      .then((x: { value: string }) => x.value)
      .catch(() => null);
  }
  public static setJSONUnsafe(key: string, value: any): Promise<void> {
    return this.setUnsafe(key, JSON.stringify(value));
  }
  public static getJSONUnsafe(key: string): Promise<any> {
    return this.getUnsafe(key)
      .then(value => JSON.parse(value))
      .catch(() => null);
  }
}

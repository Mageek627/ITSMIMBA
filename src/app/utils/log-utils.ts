import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LogUtils {
  constructor(private toastCtrl: ToastController) {}

  // Important to get a layer of abstraction above specific logging implementations
  public static log(value: any): void {
    console.log('ITSMIMBA CUSTOM LOG: ' + value);
  }
  public static error(e: any): void {
    console.error('ITSMIMBA CUSTOM ERROR: ' + e);
  }
  public async toast(value: any) {
    const toast = await this.toastCtrl.create({
      message: String(value),
      duration: 2000
    });
    await toast.present();
  }
}

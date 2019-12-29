import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LogUtils {
  constructor(private toastController: ToastController) {}

  // Important to get a layer of abstraction above specific logging implementations
  static log(value: any) {
    console.log('ITSMIMBA CUSTOM LOG: ', String(value));
  }
  static error(value: any) {
    console.error('ITSMIMBA CUSTOM ERROR: ', String(value));
  }
  async toast(value: any) {
    const toast = await this.toastController.create({
      message: String(value),
      duration: 2000
    });
    await toast.present();
  }
}

export class LogUtils {
  // Important to get a layer of abstraction above specific logging implementations
  static log(value: any) {
    console.log('ITSMIMBA CUSTOM LOG: ', String(value));
  }
  static error(value: any) {
    console.error('ITSMIMBA CUSTOM ERROR: ', String(value));
  }
}

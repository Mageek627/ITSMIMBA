export class Constants {
  public static moneyRegex = '-?[0-9]*(,|\\.)?[0-9]*';
  public static currentVersionNumber = 1;
  public static baseCurrency = 'USD';

  public static assetTypeFullName = [
    ['Fiat', 'Fiat money (Regular)'],
    ['Crypto', 'Cryptocurrency'],
    ['Metal', 'Metal'],
    ['Stock', 'Stock'],
    ['Custom', 'Custom asset']
  ];
}

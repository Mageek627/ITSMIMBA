import { AssetReference } from './asset-reference';

export class AssetDefinition {
  constructor(
    public assetRef: AssetReference,
    public name: string = '', // In English
    public decimalScale: number = 6 // How many digits after decimal points are allowed, >=0, SQL standard
  ) {}
}

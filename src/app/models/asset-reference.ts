import { AssetType } from '../enums/asset-type.enum';

export class AssetReference {
  constructor(
    public type: AssetType,
    public code: string // Must be unique inside a type. ISO 4217 for Fiat
  ) {}
}

import { AssetType } from '../enums/asset-type.enum';
import { AssetDefinition } from '../models/asset-definition';
import { AssetReference } from '../models/asset-reference';

const F = AssetType.Fiat;

export const fiatCatalogue = [
  new AssetDefinition(new AssetReference(F, 'USD'), 'United States dollar', 2),
  new AssetDefinition(new AssetReference(F, 'EUR'), 'Euro', 2),
  new AssetDefinition(new AssetReference(F, 'CAD'), 'Canadian dollar', 2),
  new AssetDefinition(new AssetReference(F, 'LBP'), 'Lebanese pound', 2),
  new AssetDefinition(new AssetReference(F, 'GBP'), 'Pound sterling', 2)
];

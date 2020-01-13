import Big from 'big.js';
import { AssetReference } from './asset-reference';

export class Valuation {
  constructor(
    public timestamp: number,
    public value: Big, // Estimated value in US dollars of one unit of an assetRef at a specific date. Not limited to decimal scale.
    public assetRef: AssetReference
  ) {}
}

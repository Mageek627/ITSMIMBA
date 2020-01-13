import Big from 'big.js';
import { AssetReference } from './asset-reference';
import { Limit } from './limit';
import { Transfer } from './transfer';

export class Account {
  constructor(
    public name: string, // Must be unique
    public assetRef: AssetReference,
    public includedInOverview: boolean = true,
    public externalTransfers: Transfer[] = [],
    public externalLimits: Limit[] = [],
    public minimumAmount: Big | null = new Big(0) // Limited to decimal scale. The minimum amount allowed in the account, often 0
  ) {}
}

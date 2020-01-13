import { Account } from './account';
import { Limit } from './limit';
import { Transfer } from './transfer';
import { TransferConditions } from './transfer-conditions';

export class AccountsGraph {
  constructor(
    public accounts: Account[] = [],
    public internalTransfers: Transfer[] = [],
    public internalLimits: Limit[] = [],
    public transfersPossibilities: TransferConditions[][] = []
  ) {}
}

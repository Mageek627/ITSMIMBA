import { DateUtils } from '../utils/date-utils';
import { AccountsGraph } from './accounts-graph';
import { AssetReference } from './asset-reference';
import { InfiniteRecurringTransfer } from './infinite-recurring-transfer';
import { Valuation } from './valuation';

export class User {
  constructor(
    public baseAsset: AssetReference,
    public accountsGraph: AccountsGraph = new AccountsGraph(),
    public valuations: Valuation[][] = [], // valuations[type][code_id][val_id]==valuation
    public holidays: Date[] = [],
    public infiniteRecurringTransfers: InfiniteRecurringTransfer[] = [],
    public simulatedUntil: number = DateUtils.now(), // We have generated the infinite recurring transfers until this date
    public transfersUniqueId: number = 0
  ) {}
}

import { TransferType } from '../enums/transfer-type.enum';

export class TransferConditions {
  constructor(
    public type: TransferType,
    public config: object | null,
    public delay: number
  ) {}
}

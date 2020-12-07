import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (acumulator: Balance, transaction: Transaction) => {
        const newBalance = { ...acumulator };
        switch (transaction.type) {
          case 'income':
            newBalance.income += +transaction.value;
            break;
          case 'outcome':
            newBalance.outcome += +transaction.value;
            break;
          default:
            break;
        }
        return newBalance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;

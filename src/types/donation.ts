export interface IDonation {
    user: string;
    amount: number;
    treeCount: number;
    affiliate?: string;
    status: 'pending' | 'completed' | 'failed';
  }
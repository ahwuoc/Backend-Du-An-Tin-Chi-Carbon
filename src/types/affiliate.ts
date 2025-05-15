export interface IAffiliate {
    user: string;
    code: string;
    commissionRate: number;
    totalEarnings: number;
    status: 'active' | 'inactive';
  }
  
  export interface IAffiliateTracking {
    affiliate: string;
    user?: string;
    action: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
  }
import { Affiliate, AffiliateTracking } from '../models/affiliate';
import { IAffiliate, IAffiliateTracking } from '../types/affiliate';

class AffiliateService {
  async getUserAffiliate(userId: string) {
    return await Affiliate.findOne({ user: userId }).populate('user', 'name email');
  }

  async createAffiliate(userId: string, code: string) {
    const affiliate = new Affiliate({ user: userId, code });
    return await affiliate.save();
  }

  async getAffiliatePartners(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const affiliates = await Affiliate.find()
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit);
    const total = await Affiliate.countDocuments();
    return { affiliates, total, page, limit };
  }

  async getTrackingHistory(page: number, limit: number) {
    const skip = (page - 1) * limit;
   

 const trackings = await AffiliateTracking.find()
      .populate('affiliate user')
      .skip(skip)
      .limit(limit);
    const total = await AffiliateTracking.countDocuments();
    return { trackings, total, page, limit };
  }

  async updatePayoutStatus(id: string, status: string) {
    return await AffiliateTracking.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export default new AffiliateService();
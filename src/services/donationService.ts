import Donation from '../models/donation';
import { IDonation } from '../types/donation';
import AffiliateService from './affiliateService';

class DonationService {
  async createDonation(data: Partial<IDonation>, userId: string) {
    const treeCount = Math.floor(data.amount! / 10); // Giả định 10 đơn vị = 1 cây
    const donation = new Donation({ ...data, user: userId, treeCount });
    if (data.affiliate) {
      await AffiliateService.updatePayoutStatus(data.affiliate.toString(), 'completed');
    }
    return await donation.save();
  }

  async getTrees(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const donations = await Donation.find({ status: 'completed' })
      .populate('user', 'name')
      .skip(skip)
      .limit(limit);
    const total = await Donation.countDocuments({ status: 'completed' });
    return { trees: donations, total, page, limit };
  }

  async getContributors(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const contributors = await Donation.find({ status: 'completed' })
      .populate('user', 'name')
      .skip(skip)
      .limit(limit)
      .select('user amount treeCount');
    const total = await Donation.countDocuments({ status: 'completed' });
    return { contributors, total, page, limit };
  }
}

export default new DonationService();
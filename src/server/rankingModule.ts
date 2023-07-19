import { RankingModule } from 'shared/types';

// waiting for qbot update to do this part
export = {
	async Rank(userId, rank) {
		return true;
	},
	async Shout(message) {
		return true;
	},
} satisfies RankingModule;

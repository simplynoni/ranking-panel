import { GroupService } from '@rbxts/services';
import config from 'server/config';
import rankingModule from 'server/rankingModule';
import { Action, PromptType } from 'shared/types';

export = {
	Name: 'Rank',
	Description: 'Moves the user to the specified rank in the group',
	Args: [
		{ Name: 'User', Type: PromptType.User },
		{ Name: 'Rank', Type: PromptType.Rank },
	],
	Permissions: config.RankingPermissions,
	Run: async (player, notification, args) => {
		// lots of checks
		const userId = args.get('User');
		const rank = args.get('Rank');
		if (!userId || !typeIs(userId, 'number')) return notification.Error('Invalid user provided');
		if (!rank || !typeIs(rank, 'number')) return notification.Error('Invalid rank provided');
		const playerRank = player.GetRankInGroup(config.GroupId);
		if (rank >= playerRank) return notification.Error('Cannot move a user to a rank above you');
		if (rank >= config.BotRank) return notification.Error('Cannot move a user to a rank above the bot');
		const userGroups = GroupService.GetGroupsAsync(userId);
		let currentRank = 0;
		for (const [_, group] of pairs(userGroups)) {
			if (group.Id === config.GroupId) {
				currentRank = group.Rank;
				break;
			}
		}
		if (currentRank === rank) return notification.Error('User is already that rank');
		if (currentRank === 0) return notification.Error('User is not in the group');
		if (currentRank >= playerRank) return notification.Error('Cannot rank a user that is above you');
		if (currentRank >= config.BotRank) return notification.Error('Cannot rank a user that is above the bot');

		const success = await rankingModule.Rank(userId, rank);
		if (success) {
			return notification.Success('Successfully ranked user');
		} else {
			return notification.Error('An error occurred. Please try again later');
		}
	},
} satisfies Action;

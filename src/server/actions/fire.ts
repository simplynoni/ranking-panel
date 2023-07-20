import { GroupService } from '@rbxts/services';
import config from 'server/config';
import rankingModule from 'server/rankingModule';
import { Action, PromptType } from 'shared/types';

export = {
	Name: 'Fire',
	Description: 'Moves the user to the lowest rank in the group',
	Args: [{ Name: 'User', Type: PromptType.User }],
	Permissions: config.RankingPermissions,
	Run: async (player, notification, args) => {
		const userId = args.get('User');
		if (!userId || !typeIs(userId, 'number')) return notification.Error('Invalid user provided');
		const userGroups = GroupService.GetGroupsAsync(userId);
		let currentRank = 0;
		for (const [_, group] of pairs(userGroups)) {
			if (group.Id === config.GroupId) {
				currentRank = group.Rank;
				break;
			}
		}
		if (currentRank === 0) return notification.Error('User is not in the group');
		if (currentRank >= config.BotRank) return notification.Error('Cannot rank a user that is above the bot');
		const groupInfo = GroupService.GetGroupInfoAsync(config.GroupId);
		const rank = groupInfo.Roles[0] ? groupInfo.Roles[0].Rank : 0;
		const playerRank = player.GetRankInGroup(config.GroupId);
		if (!rank) return notification.Error("Couldn't get the last rank in the group");
		if (currentRank === rank) return notification.Error('User is already that rank');
		if (rank >= playerRank) return notification.Error('Cannot move a user to a rank above you');
		if (rank >= config.BotRank) return notification.Error('Cannot move a user to a rank above the bot');
		if (currentRank >= playerRank) return notification.Error('Cannot rank a user that is above you');

		const success = await rankingModule.Rank(userId, rank);
		if (success) {
			return notification.Success('Successfully fired user');
		} else {
			return notification.Error('An error occurred. Please try again later, or let a developer know.');
		}
	},
} satisfies Action;

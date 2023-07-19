import { TextService } from '@rbxts/services';
import config from 'server/config';
import rankingModule from 'server/rankingModule';
import { Action, PromptType } from 'shared/types';

export = {
	Name: 'Shout',
	Description: 'Posts a shout on the group',
	Args: [{ Name: 'Message', Type: PromptType.Text }],
	Permissions: config.ShoutPermissions,
	Run: async (player, notification, args) => {
		const message = args.get('Message');
		if (message === undefined || !typeIs(message, 'string')) return notification.Error('Invalid message provided');
		let filterResult;
		let filteredText;
		try {
			filterResult = TextService.FilterStringAsync(message.gsub('#', '')[0], player.UserId);
			filteredText = filterResult.GetNonChatStringForBroadcastAsync();
		} catch {
			return notification.Error('Error filtering message');
		}
		if (filteredText.find('#')[0]) return notification.Error('Text was filtered');

		const success = await rankingModule.Shout(message);
		if (success) {
			if (message === '') {
				return notification.Success('Successfully cleared shout');
			} else {
				return notification.Success('Successfully posted shout');
			}
		} else {
			return notification.Error('An error occurred. Please try again later');
		}
	},
} satisfies Action;

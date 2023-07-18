import config from 'server/config';
import { Action, PromptType } from 'shared/types';

export = {
	Name: 'test',
	Description: 'test action',
	Args: [
		{ Name: 'test', Type: PromptType.Text },
		// { Name: 'test2', Type: PromptType.Rank },
	],
	Permissions: config.RankingPermissions,
	Run: (player, args) => {
		print(args);
	},
} satisfies Action;

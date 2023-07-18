import { Scheme, Theme, ThemeState } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';
import { GroupService } from '@rbxts/services';
import { ClientAction, PromptType } from 'shared/types';
import Panel from '.';

// for use with hoarcekat (https://github.com/Kampfkarren/hoarcekat)
export = function (frame: GuiObject) {
	const scheme = Scheme.dark(Color3.fromRGB(255, 0, 0)).Colors;
	const theme: ThemeState = {
		Color: Color3.fromRGB(120, 28, 227),
		Scheme: scheme,
		Theme: Theme.Light,
	};
	const groupInfo = GroupService.GetGroupInfoAsync(1);
	const actions: ClientAction[] = [
		{
			Name: 'Rank',
			Description: 'Moves the user to a specified rank in the group.',
			Args: [
				{
					Name: 'User',
					Type: PromptType.User,
				},
				{
					Name: 'Rank',
					Type: PromptType.Rank,
				},
			],
		},
		{
			Name: 'Promote',
			Description: 'Moves the user one rank up in the group.',
			Args: [
				{
					Name: 'User',
					Type: PromptType.User,
				},
			],
		},
	];
	const component = <Panel GroupInfo={groupInfo} BotRank={255} Actions={actions} Theme={theme} />;

	const tree = Roact.mount(component, frame);

	return () => {
		Roact.unmount(tree);
	};
};

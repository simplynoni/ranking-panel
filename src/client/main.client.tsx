import { ContainerScheme, Scheme, Theme, ThemeState } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';
import { StoreProvider } from '@rbxts/roact-rodux';
import { ContextActionService, GroupService, HttpService, Players, SoundService } from '@rbxts/services';
import { NotificationType } from 'shared/types';
import { Events } from './network';
import { clientStore } from './state';
import Panel from './ui';
import Notifications from './ui/notifications';
import Prompt from './ui/prompt';

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild('PlayerGui') as PlayerGui;

Events.InitializePanel.connect((settings, actions) => {
	const groupInfo = GroupService.GetGroupInfoAsync(settings.GroupId);
	const theme: ThemeState = {
		Color: settings.Color,
		Theme: settings.Theme,
		Scheme:
			settings.Theme === Theme.Dark ? Scheme.dark(settings.Color).Colors : Scheme.light(settings.Color).Colors,
	};

	Roact.mount(
		<StoreProvider store={clientStore}>
			<>
				<screengui Key='RankingPanel' ResetOnSpawn={false} ZIndexBehavior={'Sibling'} IgnoreGuiInset>
					<Panel GroupInfo={groupInfo} Actions={actions} Theme={theme} />
				</screengui>
				<screengui
					Key='PanelPrompt'
					ResetOnSpawn={false}
					ZIndexBehavior={'Sibling'}
					DisplayOrder={500}
					IgnoreGuiInset
				>
					<Prompt GroupInfo={groupInfo} BotRank={settings.BotRank} Theme={theme} />
				</screengui>
				<screengui
					Key='PanelNotifications'
					ResetOnSpawn={false}
					ZIndexBehavior={'Sibling'}
					DisplayOrder={1000}
					IgnoreGuiInset
				>
					<Notifications Theme={theme} />
				</screengui>
			</>
		</StoreProvider>,
		playerGui,
	);

	ContextActionService.BindAction(
		'OpenPanel',
		(_, state) => {
			if (state === Enum.UserInputState.Begin) {
				clientStore.dispatch({ type: 'SetPanelVisible', panelVisible: true });
			}
		},
		false,
		settings.Keybind,
	);

	Events.ShowPanel.connect(() => {
		clientStore.dispatch({ type: 'SetPanelVisible', panelVisible: true });
	});

	const successSound = new Instance('Sound');
	successSound.SoundId = 'rbxassetid://7018365652';
	successSound.Volume = 1;

	const errorSound = new Instance('Sound');
	errorSound.SoundId = 'rbxassetid://7018365747';
	errorSound.Volume = 2.5;

	Events.NewNotifcation.connect((notifType, text) => {
		if (settings.SoundsEnabled) {
			switch (notifType) {
				case NotificationType.Success: {
					SoundService.PlayLocalSound(successSound);
					break;
				}
				case NotificationType.Error: {
					SoundService.PlayLocalSound(errorSound);
					break;
				}
			}
		}
		clientStore.dispatch({
			type: 'AddNotification',
			notification: {
				Id: HttpService.GenerateGUID(false),
				Content: text,
				Duration: 5,
				ColorScheme: notifType === NotificationType.Error ? ContainerScheme.ErrorContainer : 'Surface',
			},
		});
	});
});

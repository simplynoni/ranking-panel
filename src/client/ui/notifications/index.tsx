import { ThemeState } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';
import { connect } from '@rbxts/roact-rodux';
import { ClientState, clientStore } from 'client/state';
import { NotificationState } from 'client/state/reducers/notificationReducer';
import Notification from './notification';

interface NotificationListProps {
	Theme: ThemeState;
}

interface NotificationListState {
	NotificationElements: Map<string, Roact.Element>;
}

class NotificationListBase extends Roact.Component<
	NotificationListProps & { Notifications: NotificationState },
	NotificationListState
> {
	constructor(props: NotificationListProps & { Notifications: NotificationState }) {
		super(props);

		this.setState({
			NotificationElements: new Map(),
		});
	}

	public render(): Roact.Element | undefined {
		return (
			<frame
				Key={'Notifications'}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={UDim2.fromScale(0.5, 0.85)}
				Size={UDim2.fromScale(0.75)}
				BackgroundTransparency={1}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, 5)}
				/>
				{this.state.NotificationElements}
			</frame>
		);
	}

	Update() {
		const notifications: Map<string, Roact.Element> = new Map();
		this.props.Notifications.forEach((notification, index) => {
			notifications.set(
				index,
				<Notification
					{...notification}
					OnClose={() => {
						clientStore.dispatch({ type: 'DeleteNotification', notificationId: index });
					}}
					Theme={this.props.Theme}
				/>,
			);
		});

		this.setState({
			NotificationElements: notifications,
		});
	}

	protected didUpdate(
		previousProps: NotificationListProps & { Notifications: NotificationState },
		previousState: {},
	): void {
		if (previousProps.Notifications !== this.props.Notifications) {
			this.Update();
		}
	}
}

export default connect<{ Notifications: NotificationState }, {}, NotificationListProps, ClientState>((state, props) => {
	return { Notifications: state.notificationState };
})(NotificationListBase);

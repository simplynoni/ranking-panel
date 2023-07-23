import { Instant, Linear, SingleMotor } from '@rbxts/flipper';
import { Icon, ThemeProps, ThemeState } from '@rbxts/material-ui';
import { Gotham, GothamBold } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { GroupService, Players, UserService } from '@rbxts/services';
import RouteBase from './pageBase';

interface SearchResults {
	Image: string;
	DisplayName: string;
	Username: string;
	UserId: number;
	InServer: boolean;
}

interface PageProps {
	PositionBinding: Roact.Binding<number>;
	FadeBinding: Roact.Binding<number>;
	Visible: boolean;
	PageVisible: boolean;
	GroupInfo: GroupInfo;
	BotRank: number;
	PromptContainerVisible: boolean;
	SelectedUser: number;
	Theme: ThemeState;
	OnChanged?: (userId: number) => void;
}

interface PageState {
	SearchText: string;
	SearchPlaceholder: boolean;
	SearchResults: SearchResults[];
	NoResults: boolean;
}

const GroupCache = new Map<number, number>();

class UserPageBase extends Roact.Component<PageProps, PageState> {
	CurrentThread?: thread;
	PlayerRank = 0;

	constructor(props: PageProps) {
		super(props);

		task.spawn(() => {
			this.PlayerRank = Players.LocalPlayer.GetRankInGroup(this.props.GroupInfo.Id);
		});

		this.setState({
			SearchText: '',
			SearchPlaceholder: true,
			NoResults: true,
			SearchResults: [],
		});

		this.UpdateSearchResults('');
	}

	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;

		const results = this.GetResults();

		return (
			<canvasgroup
				Key={'UserPage'}
				GroupTransparency={this.props.FadeBinding.map((fade) => fade)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={this.props.PositionBinding.map((x) => {
					return UDim2.fromScale(x, 0.5);
				})}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Visible={this.props.PageVisible}
				ZIndex={this.props.Visible ? 2 : 1}
			>
				<uipadding PaddingTop={new UDim(0, 5)} />
				<frame Key='SearchHolder' Size={UDim2.fromScale(1, 0.3)} BackgroundTransparency={1}>
					<textbox
						Key='Search'
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={new UDim2(1, -24, 1, 0)}
						BackgroundColor3={theme.Scheme.surfaceVariant}
						Text={this.state.SearchText}
						TextColor3={theme.Scheme.onSurfaceVariant}
						PlaceholderColor3={theme.Scheme.onSurfaceVariant}
						FontFace={GothamBold}
						TextXAlignment='Left'
						TextScaled
						LayoutOrder={1}
						Event={{
							Focused: () => {
								this.setState({
									SearchPlaceholder: false,
								});
							},
							FocusLost: (textBox) => {
								if (textBox.Text === '') {
									this.setState({
										SearchPlaceholder: true,
									});
								}
							},
						}}
						Change={{
							Text: (textBox) => {
								this.setState({
									SearchText: textBox.Text,
								});
							},
						}}
					>
						<uicorner CornerRadius={new UDim(1)} />
						<uipadding
							PaddingTop={new UDim(0, 8)}
							PaddingLeft={new UDim(0, 12)}
							PaddingRight={new UDim(0, 12)}
							PaddingBottom={new UDim(0, 8)}
						/>
						<uilistlayout
							SortOrder='LayoutOrder'
							FillDirection='Horizontal'
							VerticalAlignment='Center'
							Padding={new UDim(0, 5)}
						/>
						{this.state.SearchPlaceholder ? (
							<>
								<Icon
									Icon='rbxassetid://7293641685'
									IconSize='24p'
									IconColor={theme.Scheme.onSurfaceVariant}
									Size={UDim2.fromScale(1, 1)}
								/>
								<textlabel
									Size={new UDim2(1, 0, 1, -2)}
									BackgroundTransparency={1}
									Text='Search for a user'
									TextColor3={theme.Scheme.onSurfaceVariant}
									FontFace={Gotham}
									TextXAlignment='Left'
									TextScaled
								/>
							</>
						) : undefined}
					</textbox>
				</frame>
				<frame
					Key='NoResults'
					Position={new UDim2(0, 0, 0.3, 5)}
					Size={new UDim2(1, -2, 0.7, -5)}
					BackgroundTransparency={1}
				>
					<textlabel
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 0.2)}
						BackgroundTransparency={1}
						Text='No users found :('
						TextColor3={theme.Scheme.onSurfaceVariant}
						FontFace={Gotham}
						TextScaled
						Visible={this.state.NoResults}
					/>
				</frame>
				<scrollingframe
					Position={new UDim2(0, 0, 0.3, 5)}
					Size={new UDim2(1, -2, 0.7, -5)}
					LayoutOrder={2}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					ScrollBarImageColor3={theme.Scheme.outline}
					ScrollBarThickness={this.props.Visible ? 3 : 0}
					CanvasSize={UDim2.fromScale(0)}
					AutomaticCanvasSize='Y'
					Visible={!this.state.NoResults}
				>
					<uilistlayout SortOrder='LayoutOrder' />
					{...results}
				</scrollingframe>
			</canvasgroup>
		);
	}

	GetResults() {
		const theme = this.props.Theme;

		const results: Roact.Element[] = [];
		for (const [_, result] of pairs(this.state.SearchResults)) {
			results.push(
				<UserTile
					{...result}
					Selected={this.props.SelectedUser === result.UserId}
					Theme={theme}
					PressedEvent={() => {
						if (this.props.OnChanged) {
							this.props.OnChanged(result.UserId);
						}
					}}
				/>,
			);
		}

		return results;
	}

	async UpdateSearchResults(searchText: string) {
		const results: SearchResults[] = [];

		searchText = searchText.lower();

		for (const [_, user] of pairs(Players.GetPlayers())) {
			if (
				user !== Players.LocalPlayer &&
				(user.Name.lower().find(searchText)[0] || user.DisplayName.lower().find(searchText)[0])
			) {
				const rank = GroupCache.get(user.UserId) || user.GetRankInGroup(this.props.GroupInfo.Id);
				if (rank > 0) {
					GroupCache.set(user.UserId, rank);
				}
				if (rank === 0 || rank >= this.PlayerRank || rank >= this.props.BotRank) continue;
				const image = Players.GetUserThumbnailAsync(user.UserId, 'HeadShot', 'Size48x48')[0];
				const result: SearchResults = {
					Image: image,
					DisplayName: user.DisplayName,
					Username: user.Name,
					UserId: user.UserId,
					InServer: true,
				};
				results.push(result);
			}
		}

		if (results.size() === 0 && searchText !== Players.LocalPlayer.Name) {
			const [_, userId] = pcall(() => {
				return Players.GetUserIdFromNameAsync(searchText);
			});

			if (userId && typeIs(userId, 'number')) {
				let rank = GroupCache.get(userId);
				if (!rank) {
					const groups = GroupService.GetGroupsAsync(userId);
					for (const [_, group] of pairs(groups)) {
						if (group.Id === this.props.GroupInfo.Id) {
							rank = group.Rank;
							GroupCache.set(userId, rank);
						}
					}
					if (!rank) rank = 0;
				}
				if (rank > 0 && rank < this.PlayerRank && rank < this.props.BotRank) {
					const userInfo = await Promise.try(
						() => UserService.GetUserInfosByUserIdsAsync([userId])[0],
					).catch();
					const [image] = await Promise.try(() =>
						Players.GetUserThumbnailAsync(userId, 'HeadShot', 'Size48x48'),
					).catch();
					if (userInfo) {
						const result: SearchResults = {
							Image: image,
							DisplayName: userInfo.DisplayName,
							Username: userInfo.Username,
							UserId: userId,
							InServer: false,
						};
						results.push(result);
					}
				}
			}
		}

		this.setState({
			NoResults: results.size() === 0,
			SearchResults: results,
		});
	}

	protected didUpdate(previousProps: PageProps, previousState: PageState): void {
		if (
			previousProps.PromptContainerVisible !== this.props.PromptContainerVisible &&
			this.props.PromptContainerVisible
		) {
			this.setState({
				SearchPlaceholder: true,
				SearchText: '',
			});
		}
		if (this.state.SearchText !== previousState.SearchText) {
			if (this.CurrentThread) {
				task.cancel(this.CurrentThread);
			}
			this.CurrentThread = task.spawn(() => this.UpdateSearchResults(this.state.SearchText));
		}
	}
}

interface UserTileProps extends ThemeProps {
	Image: string;
	DisplayName: string;
	Username: string;
	InServer: boolean;
	Selected: boolean;
	LayoutOrder?: number;
	PressedEvent?: () => void;
}

class UserTile extends Roact.PureComponent<UserTileProps> {
	stateMotor: SingleMotor;
	stateBinding: Roact.Binding<number>;

	constructor(props: UserTileProps) {
		super(props);

		this.stateMotor = new SingleMotor(this.props.Selected ? 0.12 : 0);

		const [stateBinding, setStateBinding] = Roact.createBinding(this.stateMotor.getValue());

		this.stateBinding = stateBinding;

		this.stateMotor.onStep(setStateBinding);
	}

	render() {
		const theme = this.props.Theme;

		return (
			<textbutton
				Key='UserTile'
				Size={new UDim2(1, 0, 0, 40)}
				LayoutOrder={this.props.LayoutOrder}
				Text=''
				BorderSizePixel={0}
				BackgroundTransparency={this.stateBinding.map((opacity) => {
					return 1 - opacity;
				})}
				BackgroundColor3={theme.Scheme.onBackground}
				AutoButtonColor={false}
				Event={{
					MouseButton1Click: async () => {
						if (this.props.PressedEvent && !this.props.Selected) {
							this.props.PressedEvent();
						}
					},
					MouseButton1Up: async () => {
						if (this.props.Selected) return;
						this.stateMotor.setGoal(new Linear(0.08, { velocity: 0.5 }));
					},
					MouseEnter: () => {
						if (this.props.Selected) return;
						this.stateMotor.setGoal(new Linear(0.08, { velocity: 0.5 }));
					},
					MouseButton1Down: () => {
						if (this.props.Selected) return;
						this.stateMotor.setGoal(new Linear(0.12, { velocity: 0.5 }));
					},
					MouseLeave: () => {
						if (this.props.Selected) return;
						this.stateMotor.setGoal(new Linear(0, { velocity: 0.5 }));
					},
				}}
			>
				<frame
					Key='Divider'
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 1, 1)}
					Size={new UDim2(1, -24, 0, 1)}
					BorderSizePixel={0}
					BackgroundColor3={theme.Scheme.outline}
				/>
				<frame
					Key='LeftAlign'
					AnchorPoint={new Vector2(0, 0.5)}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
				>
					<uipadding
						PaddingBottom={new UDim(0, 5)}
						PaddingLeft={new UDim(0, 12)}
						PaddingRight={new UDim(0, 12)}
						PaddingTop={new UDim(0, 5)}
					/>
					<uilistlayout
						Padding={new UDim(0, 12)}
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					<imagelabel
						Size={UDim2.fromScale(0.1, 1)}
						BackgroundColor3={theme.Scheme.surfaceVariant}
						Image={this.props.Image}
					>
						<uiaspectratioconstraint
							AspectRatio={1}
							DominantAxis='Height'
							AspectType='ScaleWithParentSize'
						/>
						<uicorner CornerRadius={new UDim(1)} />
					</imagelabel>
					<frame Key='TextHolder' Size={UDim2.fromScale(0.9, 1)} BackgroundTransparency={1} LayoutOrder={2}>
						<uilistlayout
							Padding={new UDim(0, 5)}
							FillDirection={Enum.FillDirection.Vertical}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						<textlabel
							Key='Name'
							LayoutOrder={1}
							Size={UDim2.fromScale(1, 0.45)}
							BackgroundTransparency={1}
							FontFace={GothamBold}
							Text={`<font color="#${theme.Scheme.onSurfaceVariant.ToHex()}" face="GothamMedium">${
								this.props.DisplayName
							}</font> @${this.props.Username}`}
							TextColor3={theme.Scheme.onBackground}
							TextXAlignment={Enum.TextXAlignment.Left}
							RichText
							TextScaled
						>
							<uitextsizeconstraint MaxTextSize={18} />
						</textlabel>
						{this.props.InServer ? (
							<textlabel
								Key='InServer'
								LayoutOrder={2}
								Size={UDim2.fromScale(1, 0.35)}
								BackgroundTransparency={1}
								FontFace={Gotham}
								Text={'In your server'}
								TextColor3={theme.Scheme.onBackground}
								TextXAlignment={Enum.TextXAlignment.Left}
								TextScaled
							>
								<uitextsizeconstraint MaxTextSize={14} />
							</textlabel>
						) : undefined}
					</frame>
				</frame>
			</textbutton>
		);
	}

	protected didUpdate(previousProps: UserTileProps, previousState: {}): void {
		if (previousProps.Selected !== this.props.Selected) {
			if (this.props.Selected) {
				this.stateMotor.setGoal(new Instant(0.12));
			} else {
				this.stateMotor.setGoal(new Linear(0, { velocity: 0.5 }));
			}
		}
	}
}

export default class UserPage extends RouteBase<{
	GroupInfo: GroupInfo;
	BotRank: number;
	PromptContainerVisible: boolean;
	SelectedUser: number;
	Theme: ThemeState;
	OnChanged?: (userId: number) => void;
}> {
	render() {
		return (
			<UserPageBase
				PageVisible={this.state.PageVisible}
				PositionBinding={this.positionBinding}
				FadeBinding={this.fadeBinding}
				{...this.props}
			/>
		);
	}
}

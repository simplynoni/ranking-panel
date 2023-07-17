import { Linear, SingleMotor } from '@rbxts/flipper';
import { Icon, ThemeProps, ThemeState } from '@rbxts/material-ui';
import { Gotham, GothamBold } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { RouteRendererProps } from '@rbxts/roact-router/typings/Route';
import { GroupService, Players } from '@rbxts/services';
import RouteBase from './routeBase';

interface SearchResults {
	Name: string;
	Rank: number;
}

interface PageProps extends RouteRendererProps {
	PositionBinding: Roact.Binding<number>;
	FadeBinding: Roact.Binding<number>;
	Visible: boolean;
	Theme: ThemeState;
	GroupId: number;
}

interface PageState {
	SearchText: string;
	SearchPlaceholder: boolean;
	SearchResults: SearchResults[];
	NoResults: boolean;
}

class RankPageBase extends Roact.Component<PageProps, PageState> {
	GroupInfo: GroupInfo;
	CurrentThread?: thread;

	constructor(props: PageProps) {
		super(props);

		this.GroupInfo = GroupService.GetGroupInfoAsync(this.props.GroupId);

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

		const results: Roact.Element[] = [];
		for (const [_, result] of pairs(this.state.SearchResults)) {
			results.push(<RankTile {...result} Theme={theme} />);
		}

		return (
			<canvasgroup
				Key={'RankPage'}
				GroupTransparency={this.props.FadeBinding.map((fade) => fade)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={this.props.PositionBinding.map((x) => {
					return UDim2.fromScale(x, 0.5);
				})}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Visible={this.props.Visible}
				ZIndex={this.props.match ? 2 : 1}
			>
				<uipadding PaddingTop={new UDim(0, 5)} />
				<frame Key='SearchHolder' Size={UDim2.fromScale(1, 0.3)} BackgroundTransparency={1}>
					<textbox
						Key='Search'
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={new UDim2(1, -24, 1, 0)}
						BackgroundColor3={theme.Scheme.surfaceVariant}
						Text=''
						TextColor3={theme.Scheme.onSurfaceVariant}
						PlaceholderColor3={theme.Scheme.onSurfaceVariant}
						FontFace={GothamBold}
						TextXAlignment='Left'
						TextScaled
						LayoutOrder={1}
						Event={{
							Focused: () => {
								this.props.history.goBack();
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
									Text='Search for a rank'
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
						Text='No ranks found :('
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
					ScrollBarThickness={3}
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

	async UpdateSearchResults(searchText: string) {
		const results: SearchResults[] = [];

		searchText = searchText.lower();

		for (const [_, role] of pairs(this.GroupInfo.Roles)) {
			if (role.Rank >= Players.LocalPlayer.GetRankInGroup(this.props.GroupId)) continue;
			if (role.Name.lower().find(searchText)[0] || tostring(role.Rank).lower().find(searchText)[0]) {
				results.push(role);
			}
		}

		this.setState({
			NoResults: results.size() === 0,
			SearchResults: results,
		});
	}

	protected didUpdate(previousProps: PageProps, previousState: PageState): void {
		if (this.state.SearchText !== previousState.SearchText) {
			if (this.CurrentThread) {
				task.cancel(this.CurrentThread);
			}
			this.CurrentThread = task.spawn(() => this.UpdateSearchResults(this.state.SearchText));
		}
	}
}

interface RankTileProps extends ThemeProps {
	Name: string;
	Rank: number;
	PressedEvent?: () => void;
}

class RankTile extends Roact.PureComponent<RankTileProps> {
	stateMotor: SingleMotor;
	stateBinding: Roact.Binding<number>;

	constructor(props: RankTileProps) {
		super(props);

		this.stateMotor = new SingleMotor(0);

		const [stateBinding, setStateBinding] = Roact.createBinding(this.stateMotor.getValue());

		this.stateBinding = stateBinding;

		this.stateMotor.onStep(setStateBinding);
	}

	render() {
		const theme = this.props.Theme;

		return (
			<textbutton
				Key='RankTile'
				Size={new UDim2(1, 0, 0, 30)}
				LayoutOrder={-this.props.Rank}
				Text=''
				BorderSizePixel={0}
				BackgroundTransparency={this.stateBinding.map((opacity) => {
					return 1 - opacity;
				})}
				BackgroundColor3={theme.Scheme.onBackground}
				AutoButtonColor={false}
				Event={{
					MouseButton1Click: async () => {
						if (this.props.PressedEvent) {
							this.props.PressedEvent();
						}
					},
					MouseButton1Up: async () => {
						this.stateMotor.setGoal(new Linear(0.08, { velocity: 0.5 }));
					},
					MouseEnter: () => {
						this.stateMotor.setGoal(new Linear(0.08, { velocity: 0.5 }));
					},
					MouseButton1Down: () => {
						this.stateMotor.setGoal(new Linear(0.12, { velocity: 0.5 }));
					},
					MouseLeave: () => {
						this.stateMotor.setGoal(new Linear(0, { velocity: 0.5 }));
					},
				}}
			>
				<uipadding PaddingLeft={new UDim(0, 12)} PaddingRight={new UDim(0, 12)} />
				<frame
					Key='Divider'
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 1, 1)}
					Size={new UDim2(1, -24, 0, 1)}
					BorderSizePixel={0}
					BackgroundColor3={theme.Scheme.outline}
				/>
				<textlabel
					Key='Rank'
					AnchorPoint={new Vector2(0, 0.5)}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromScale(1, 0.75)}
					BackgroundTransparency={1}
					FontFace={GothamBold}
					Text={`${
						this.props.Name
					}<font color="#${theme.Scheme.onSurfaceVariant.ToHex()}" face="GothamMedium"> (${
						this.props.Rank
					})</font>`}
					TextColor3={theme.Scheme.onBackground}
					TextXAlignment={Enum.TextXAlignment.Left}
					RichText
					TextScaled
				>
					<uitextsizeconstraint MaxTextSize={18} />
				</textlabel>
			</textbutton>
		);
	}
}

export default class RankPage extends RouteBase<{ Theme: ThemeState; GroupId: number }> {
	render() {
		return (
			<RankPageBase
				Visible={this.state.Visible}
				PositionBinding={this.positionBinding}
				FadeBinding={this.fadeBinding}
				{...this.props}
			/>
		);
	}
}

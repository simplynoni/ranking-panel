import { Dictionary } from '@rbxts/llama';
import { OutlinedButton, ThemeState, TonalButton, Topbar, UIBase } from '@rbxts/material-ui';
import { Gotham } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { Events } from 'client/network';
import { clientStore } from 'client/state';
import { PromptArg, PromptType } from 'shared/types';
import ConfirmationPage from './confirmationPrompt';
import RankPage from './rankPrompt';
import TextPage from './textPrompt';
import UserPage from './userPrompt';

interface PromptProps {
	GroupInfo: GroupInfo;
	BotRank: number;
	Visible: boolean;
	Theme: ThemeState;
	Name: string;
	Args: PromptArg[];
}

interface PromptState {
	PageIndex: number;
	Instant: boolean;
	Args: Map<string, unknown>;
}

export default class Prompt extends Roact.Component<PromptProps, PromptState> {
	constructor(props: PromptProps) {
		super(props);

		this.setState({
			PageIndex: 0,
			Instant: true,
			Args: new Map(),
		});
	}

	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;
		const currentArg = this.props.Args[this.state.PageIndex];

		const pages: Roact.Element[] = [];
		for (const [index, arg] of pairs(this.props.Args)) {
			switch (arg.Type) {
				case PromptType.Rank: {
					let selectedRank = 0;
					const argValue = this.state.Args.get(arg.Name);
					if (argValue && typeIs(argValue, 'number')) {
						selectedRank = argValue;
					}
					pages.push(
						<RankPage
							GroupInfo={this.props.GroupInfo}
							BotRank={this.props.BotRank}
							PromptContainerVisible={this.props.Visible}
							Visible={index === this.state.PageIndex + 1}
							Instant={this.state.Instant}
							SelectedRank={selectedRank}
							OnChanged={(rank) => {
								const args = this.state.Args;
								args.set(arg.Name, rank);
								this.setState({
									Args: args,
								});
							}}
							Theme={theme}
						/>,
					);
					break;
				}
				case PromptType.User: {
					let selectedUser = 0;
					const argValue = this.state.Args.get(arg.Name);
					if (argValue && typeIs(argValue, 'number')) {
						selectedUser = argValue;
					}
					pages.push(
						<UserPage
							GroupInfo={this.props.GroupInfo}
							BotRank={this.props.BotRank}
							PromptContainerVisible={this.props.Visible}
							Visible={index === this.state.PageIndex + 1}
							Instant={this.state.Instant}
							SelectedUser={selectedUser}
							OnChanged={(userId) => {
								const args = this.state.Args;
								args.set(arg.Name, userId);
								this.setState({
									Args: args,
								});
							}}
							Theme={theme}
						/>,
					);
					break;
				}
				case PromptType.Text: {
					pages.push(
						<TextPage
							Name={arg.Name}
							PromptContainerVisible={this.props.Visible}
							Visible={index === this.state.PageIndex + 1}
							Instant={this.state.Instant}
							OnChanged={(text) => {
								const args = this.state.Args;
								args.set(arg.Name, text);
								this.setState({
									Args: args,
								});
							}}
							Theme={theme}
						/>,
					);
				}
			}
		}
		pages.push(
			<ConfirmationPage
				GroupInfo={this.props.GroupInfo}
				Args={Dictionary.copyDeep(this.props.Args)}
				ArgValues={Dictionary.copyDeep(this.state.Args)}
				Visible={this.state.PageIndex === this.props.Args.size()}
				Instant={this.state.Instant}
				Theme={theme}
			/>,
		);

		return (
			<UIBase
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.6, 0.65)}
				Theme={theme}
				Closed={!this.props.Visible}
			>
				<uilistlayout SortOrder='LayoutOrder' />
				<Topbar
					Title={`${
						this.props.Name
					} <font color="#${theme.Scheme.onSurfaceVariant.ToHex()}" face="GothamMedium">> ${
						currentArg ? currentArg.Name : 'Confirmation'
					}</font>`}
					Height={new UDim(0.2)}
					TextAlignment={Enum.TextXAlignment.Left}
					RichText
					Theme={theme}
					CloseFunction={() => {
						const args = this.state.Args;
						args.clear();
						this.setState({
							Args: args,
						});
						clientStore.dispatch({ type: 'SetPromptVisible', promptVisible: false });
					}}
				/>
				<frame Key='Content' Size={UDim2.fromScale(1, 0.6)} BackgroundTransparency={1}>
					{...pages}
				</frame>
				<frame Key='Footer' Size={UDim2.fromScale(1, 0.2)} BackgroundTransparency={1}>
					<frame
						Key='Divider'
						Size={new UDim2(1, 0, 0, 1)}
						BorderSizePixel={0}
						BackgroundColor3={theme.Scheme.outline}
					/>
					<OutlinedButton
						AnchorPoint={new Vector2(0, 0.5)}
						Position={new UDim2(0, 12, 0.5, 0)}
						Size={new UDim2(0, 0, 1, -10)}
						Text='Back'
						AutomaticSize
						Theme={theme}
						Pressed={() => {
							this.setState({
								PageIndex: math.max(this.state.PageIndex - 1, 0),
								Instant: false,
							});
						}}
						Disabled={this.state.PageIndex === 0}
					/>
					<textlabel
						Key='PromptCount'
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={new UDim2(0.5, 0, 1, -10)}
						BackgroundTransparency={1}
						Text={`Prompt <font color="#${theme.Scheme.onSurface.ToHex()}" face="GothamMedium">${
							this.state.PageIndex + 1
						}</font> of ${this.props.Args.size() + 1}`}
						TextColor3={theme.Scheme.onSurfaceVariant}
						FontFace={Gotham}
						RichText
						TextScaled
					>
						<uipadding PaddingBottom={new UDim(0, 6)} PaddingTop={new UDim(0, 6)} />
					</textlabel>
					<TonalButton
						AnchorPoint={new Vector2(1, 0.5)}
						Position={new UDim2(1, -12, 0.5, 0)}
						Size={new UDim2(0, 0, 1, -10)}
						Text={this.state.PageIndex === this.props.Args.size() ? 'Submit' : 'Next'}
						AutomaticSize
						Theme={theme}
						Pressed={() => {
							if (this.state.PageIndex === this.props.Args.size()) {
								Events.RunAction.fire(this.props.Name, this.state.Args);

								clientStore.dispatch({ type: 'SetPromptVisible', promptVisible: false });

								const args = this.state.Args;
								args.clear();
								this.setState({
									Args: args,
								});
							}

							this.setState({
								PageIndex: math.min(this.state.PageIndex + 1, this.props.Args.size()),
								Instant: false,
							});
						}}
						Disabled={
							this.state.PageIndex === this.props.Args.size()
								? false
								: this.props.Args[this.state.PageIndex]
								? this.state.Args.get(this.props.Args[this.state.PageIndex].Name) === undefined
								: true
						}
					/>
				</frame>
			</UIBase>
		);
	}

	protected didUpdate(previousProps: PromptProps, previousState: PromptState): void {
		if (previousProps.Visible !== this.props.Visible && this.props.Visible) {
			for (const [_, arg] of pairs(this.props.Args)) {
				if (arg.Type !== PromptType.Text) continue;
				const args = this.state.Args;
				if (args.get(arg.Name) === undefined) {
					args.set(arg.Name, '');
					this.setState({
						Args: args,
					});
				}
			}
			this.setState({
				PageIndex: 0,
				Instant: true,
			});
		}
	}
}

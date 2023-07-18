import { Dictionary } from '@rbxts/llama';
import { ThemeState } from '@rbxts/material-ui';
import { Gotham, GothamBold, GothamMedium } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { UserService } from '@rbxts/services';
import { PromptArg, PromptType } from 'shared/types';
import RouteBase from './pageBase';

interface PageProps {
	PositionBinding: Roact.Binding<number>;
	FadeBinding: Roact.Binding<number>;
	Visible: boolean;
	PageVisible: boolean;
	GroupInfo: GroupInfo;
	Args: PromptArg[];
	ArgValues: Map<string, unknown>;
	Theme: ThemeState;
}

interface PageState {
	Elements: Roact.Element[];
}

class ConfirmationPageBase extends Roact.Component<PageProps, PageState> {
	constructor(props: PageProps) {
		super(props);

		this.setState({
			Elements: [],
		});
	}

	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;

		return (
			<canvasgroup
				Key={'ConfirmationPage'}
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
				<uilistlayout SortOrder='LayoutOrder' />
				<textlabel
					Size={UDim2.fromScale(1, 0.25)}
					BackgroundTransparency={1}
					Text='Is this correct?'
					FontFace={GothamBold}
					TextColor3={theme.Scheme.onBackground}
					TextXAlignment='Left'
					TextScaled
				>
					<uipadding
						PaddingBottom={new UDim(0, 5)}
						PaddingLeft={new UDim(0, 12)}
						PaddingRight={new UDim(0, 12)}
						PaddingTop={new UDim(0, 5)}
					/>
				</textlabel>
				{...this.state.Elements}
			</canvasgroup>
		);
	}

	protected didUpdate(previousProps: PageProps, previousState: {}): void {
		if (
			!Dictionary.equalsDeep(previousProps.ArgValues, this.props.ArgValues) ||
			!Dictionary.equalsDeep(previousProps.Args, this.props.Args)
		) {
			const theme = this.props.Theme;

			const elements: Roact.Element[] = [];
			for (const [_, arg] of pairs(this.props.Args)) {
				const argValue = this.props.ArgValues.get(arg.Name);
				if (!argValue) continue;
				if (arg.Type === PromptType.Rank && typeIs(argValue, 'number')) {
					let rankName = '';
					for (const [_, rank] of pairs(this.props.GroupInfo.Roles)) {
						if (rank.Rank === argValue) {
							rankName = rank.Name;
						}
					}
					elements.push(
						<>
							<textlabel
								Size={UDim2.fromScale(1, 0.2)}
								BackgroundTransparency={1}
								Text={arg.Name}
								FontFace={GothamMedium}
								TextColor3={theme.Scheme.onBackground}
								TextXAlignment='Left'
								TextScaled
							>
								<uipadding
									PaddingBottom={new UDim(0, 5)}
									PaddingLeft={new UDim(0, 12)}
									PaddingRight={new UDim(0, 12)}
								/>
							</textlabel>
							<textlabel
								Size={UDim2.fromScale(1, 0.175)}
								BackgroundTransparency={1}
								Text={`${rankName} (${argValue})`}
								FontFace={Gotham}
								TextColor3={theme.Scheme.onBackground}
								TextXAlignment='Left'
								TextScaled
							>
								<uipadding
									PaddingBottom={new UDim(0, 5)}
									PaddingLeft={new UDim(0, 12)}
									PaddingRight={new UDim(0, 12)}
								/>
							</textlabel>
						</>,
					);
				} else if (arg.Type === PromptType.User && typeIs(argValue, 'number')) {
					const userInfo = UserService.GetUserInfosByUserIdsAsync([argValue])[0];
					if (!userInfo) continue;
					elements.push(
						<>
							<textlabel
								Size={UDim2.fromScale(1, 0.2)}
								BackgroundTransparency={1}
								Text={arg.Name}
								FontFace={GothamMedium}
								TextColor3={theme.Scheme.onBackground}
								TextXAlignment='Left'
								TextScaled
							>
								<uipadding
									PaddingBottom={new UDim(0, 5)}
									PaddingLeft={new UDim(0, 12)}
									PaddingRight={new UDim(0, 12)}
								/>
							</textlabel>
							<textlabel
								Size={UDim2.fromScale(1, 0.175)}
								BackgroundTransparency={1}
								Text={`${userInfo.DisplayName} (@${userInfo.Username})`}
								FontFace={Gotham}
								TextColor3={theme.Scheme.onBackground}
								TextXAlignment='Left'
								TextScaled
							>
								<uipadding
									PaddingBottom={new UDim(0, 5)}
									PaddingLeft={new UDim(0, 12)}
									PaddingRight={new UDim(0, 12)}
								/>
							</textlabel>
						</>,
					);
				}
			}
			this.setState({
				Elements: elements,
			});
		}
	}
}

export default class ConfirmationPage extends RouteBase<{
	Theme: ThemeState;
	GroupInfo: GroupInfo;
	Args: PromptArg[];
	ArgValues: Map<string, unknown>;
}> {
	render() {
		return (
			<ConfirmationPageBase
				PageVisible={this.state.PageVisible}
				PositionBinding={this.positionBinding}
				FadeBinding={this.fadeBinding}
				{...this.props}
			/>
		);
	}
}

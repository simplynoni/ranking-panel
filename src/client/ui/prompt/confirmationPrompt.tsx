import { Dictionary } from '@rbxts/llama';
import { ThemeState } from '@rbxts/material-ui';
import { Gotham, GothamMedium } from '@rbxts/material-ui/out/Fonts';
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
	Fields: Roact.Element[];
}

class ConfirmationPageBase extends Roact.Component<PageProps, PageState> {
	constructor(props: PageProps) {
		super(props);

		this.setState({
			Fields: [],
		});
	}

	public render(): Roact.Element | undefined {
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
				{...this.state.Fields}
			</canvasgroup>
		);
	}

	GetFields() {
		const theme = this.props.Theme;

		const fields: Roact.Element[] = [];
		for (const [_, arg] of pairs(this.props.Args)) {
			const argValue = this.props.ArgValues.get(arg.Name);
			if (argValue === undefined) continue;
			if (arg.Type === PromptType.Rank && typeIs(argValue, 'number')) {
				let rankName = '';
				for (const [_, rank] of pairs(this.props.GroupInfo.Roles)) {
					if (rank.Rank === argValue) {
						rankName = rank.Name;
					}
				}
				fields.push(<Field Title={arg.Name} Body={`${rankName} (${argValue})`} Theme={theme} />);
			} else if (arg.Type === PromptType.User && typeIs(argValue, 'number')) {
				const userInfo = UserService.GetUserInfosByUserIdsAsync([argValue])[0];
				if (!userInfo) continue;
				fields.push(
					<Field Title={arg.Name} Body={`${userInfo.DisplayName} (@${userInfo.Username})`} Theme={theme} />,
				);
			} else if (arg.Type === PromptType.Text && typeIs(argValue, 'string')) {
				fields.push(<Field Title={arg.Name} Body={argValue || '(empty)'} Truncate Theme={theme} />);
			}
		}
		return fields;
	}

	protected didUpdate(previousProps: PageProps, previousState: PageState): void {
		if (
			!Dictionary.equalsDeep(previousProps.ArgValues, this.props.ArgValues) ||
			!Dictionary.equalsDeep(previousProps.Args, this.props.Args)
		) {
			const fields = this.GetFields();
			this.setState({
				Fields: fields,
			});
		}
	}
}

interface FieldProps {
	Title: string;
	Body: string;
	Truncate?: boolean;
	Theme: ThemeState;
}

class Field extends Roact.Component<FieldProps> {
	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;

		return (
			<>
				<textlabel
					Size={UDim2.fromScale(1, 0.2)}
					BackgroundTransparency={1}
					Text={this.props.Title}
					FontFace={GothamMedium}
					TextColor3={theme.Scheme.onBackground}
					TextXAlignment='Left'
					TextScaled
				>
					<uipadding
						PaddingTop={new UDim(0, 5)}
						PaddingLeft={new UDim(0, 12)}
						PaddingRight={new UDim(0, 12)}
					/>
				</textlabel>
				<textlabel
					Size={UDim2.fromScale(1, 0.175)}
					BackgroundTransparency={1}
					Text={this.props.Body}
					FontFace={Gotham}
					TextColor3={theme.Scheme.onBackground}
					TextXAlignment='Left'
					TextTruncate={this.props.Truncate ? 'AtEnd' : undefined}
					TextScaled
				>
					<uipadding
						PaddingTop={new UDim(0, 5)}
						PaddingLeft={new UDim(0, 12)}
						PaddingRight={new UDim(0, 12)}
					/>
					{this.props.Truncate ? <uitextsizeconstraint MinTextSize={15} /> : undefined}
				</textlabel>
			</>
		);
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

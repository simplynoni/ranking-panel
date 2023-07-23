import { Flamework } from '@flamework/core';
import { HttpService } from '@rbxts/services';
import { RankingModule } from 'shared/types';

// https://simplynoni.gitbook.io/ranking-panel/setup/ranking-module-configuration
const rankingModuleConfig = {
	URL: '',
	ApiKey: '',
} satisfies RankingModuleConfig;

// Do not touch anything beyond this point! (unless you know what you're doing)

interface RankingModuleConfig {
	URL: string;
	ApiKey: string;
}

interface ResponseBody {
	success: boolean;
	msg?: string;
}

const confgTypecheck = Flamework.createGuard<RankingModuleConfig>();
if (!confgTypecheck(rankingModuleConfig)) {
	throw "RankingPanel | Ranking module config failed typecheck! Make sure you didn't delete anything, or add invalid values.";
}

// add '/' to end of url
const URL = rankingModuleConfig.URL;
if (URL.sub(URL.size()) !== '/') {
	rankingModuleConfig.URL = URL + '/';
}

const bodyTypecheck = Flamework.createGuard<ResponseBody>();

function HandleResponse(requestType: string, response: RequestAsyncResponse) {
	if (response.StatusCode === 401) {
		warn(`${requestType} request returned status code 401. Is your API key valid?`);
		return false;
	} else if (!response.Success) {
		warn(`${requestType} request failed.`);
		return false;
	}
	const body = HttpService.JSONDecode(response.Body);
	if (!bodyTypecheck(body)) {
		warn(`${requestType} request returned invalid body.`);
		return false;
	}
	if (!body.success) {
		warn(`${requestType}ing failed:`, body.msg);
		return false;
	}
	return true;
}

export = {
	async Rank(userId, rank) {
		let response;
		try {
			response = HttpService.RequestAsync({
				Url: rankingModuleConfig.URL + 'setrank',
				Method: 'POST',
				Headers: { ['Content-Type']: 'application/json', ['authorization']: rankingModuleConfig.ApiKey },
				Body: HttpService.JSONEncode({
					id: userId,
					role: rank,
				}),
			});
		} catch (err) {
			warn('Rank request failed:', err);
			return false;
		}

		return HandleResponse('Rank', response);
	},
	async Shout(message) {
		let response;
		try {
			response = HttpService.RequestAsync({
				Url: rankingModuleConfig.URL + 'shout',
				Method: 'POST',
				Headers: { ['Content-Type']: 'application/json', ['authorization']: rankingModuleConfig.ApiKey },
				Body: HttpService.JSONEncode({
					content: message,
				}),
			});
		} catch (err) {
			warn('Shout request failed:', err);
			return false;
		}

		return HandleResponse('Shout', response);
	},
} satisfies RankingModule;

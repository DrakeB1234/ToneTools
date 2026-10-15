import { exercisesData, toolsData } from "./appData";
import { readStorage, writeStorage } from "./storage";

const STORAGE_KEY = "ToneTools_LastUsed";
const MAX_ITEMS = 5;

const validUrls = [...toolsData.map((e) => e.href), ...exercisesData.map((e) => e.href)];

function loadInitial(): string[] {
	return readStorage<string[]>(STORAGE_KEY, []);
}

class LastUsedService {
	private lastUsedIds = $state<string[]>(loadInitial());

	get lastUsedIdsList() {
		return this.lastUsedIds;
	}

	private persist() {
		writeStorage(STORAGE_KEY, this.lastUsedIds);
	}

	// Only add URLS from valid sources (/tools/name || /exercises/name)
	addLastUsed(pathname: string) {
		const matchedBaseUrl = validUrls.find(
			(url) => pathname === url || pathname.startsWith(url + "/")
		);

		if (!matchedBaseUrl) return;

		const withoutExisting = this.lastUsedIds.filter((existingId) => existingId !== matchedBaseUrl);
		this.lastUsedIds = [matchedBaseUrl, ...withoutExisting].slice(0, MAX_ITEMS);
		this.persist();
	}
}

export const lastUsedService = new LastUsedService();

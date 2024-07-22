import browser from "webextension-polyfill";
import { injectable } from "inversify";

export interface IStore {
    incrementRequestCount(): void;
    incrementBlockedCount(): void;
    addBlockedRequest(url: string): void;
}

export const StoreType = Symbol("IStore");

@injectable()
export class Store implements IStore {
    private static BUFFER_SIZE = 10_000;
    private requestCount = 0;
    private blockedCount = 0;
    private blockedRequests: string[] = [];
   
    incrementRequestCount(): void {
        this.requestCount++;
    }
    incrementBlockedCount(): void {
        this.blockedCount++;
    }
    addBlockedRequest(url: string): void {
        this.blockedRequests.push(url);
        if (this.blockedRequests.length >= Store.BUFFER_SIZE) {
            this._flush();
        }
    }
    _flush(): void {
        browser.storage.local.get().then((data) => {
            const blockedRequests = this.blockedRequests.concat(data.blockedRequests || []);
            browser.storage.local.set({
                requestCount: this.requestCount,
                blockedCount: this.blockedCount,
                blockedRequests: blockedRequests
            });
            this.blockedRequests = [];
        });
    }
}
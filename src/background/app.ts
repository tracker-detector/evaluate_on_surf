import { inject, injectable } from "inversify";
import { ExtractorType, type IExtractor } from "./extractor";
import { ClassifierType, type IClassifier } from "./classifier";
import browser from "webextension-polyfill";
import { type IStore, StoreType } from "./store";
export interface IApp {
    start(): void;
}

export const AppType = Symbol("IApp");

@injectable()
export class App implements IApp {
    private static readonly URL_FILTER = { urls: ["http://*/*", "https://*/*"] };

    constructor(
        @inject(ExtractorType) private extractor: IExtractor,
        @inject(ClassifierType) private classifier: IClassifier,
        @inject(StoreType) private store: IStore
    ) { }


    start(): void {
        browser.webRequest.onBeforeSendHeaders.addListener(
            (details) => {
                const features = this.extractor.extract(details);
                const result = this.classifier.predict(features);
                this.store.incrementRequestCount();
                if (result >= 0.5) { // TODO make threshhold configurable
                    this.store.incrementBlockedCount();
                    this.store.addBlockedRequest(details.url);
                    return { cancel: true };
                }
            },
            App.URL_FILTER,
            ["requestHeaders", "blocking"]
        );

        console.log("Application Started");
    }
}

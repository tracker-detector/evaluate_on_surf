import browser from "webextension-polyfill";
import { injectable } from "inversify";

export interface IExtractor {
    extract(
      details: browser.WebRequest.OnBeforeSendHeadersDetailsType
    ): number[];
}

export const ExtractorType = Symbol("IExtractor");

@injectable()
export class Extractor implements IExtractor {
    private static methods = [
        "GET",
        "POST",
        "OPTIONS",
        "HEAD",
        "PUT",
        "DELETE",
        "SEARCH",
        "PATCH",
        "CONNECT",
        "TRACE",
    ];
    
      private static types = [
        "xmlhttprequest",
        "image",
        "font",
        "script",
        "stylesheet",
        "ping",
        "sub_frame",
        "other",
        "main_frame",
        "csp_report",
        "object",
        "media",
        "websocket"
    ];
    private _encodeUrl(url: string) {
        let encoding = [];
        for (let i = 0; i < url.length; i++) {
          encoding.push((url.charCodeAt(i) % 89) + 1);
        }
        if (encoding.length < 200) {
          encoding = new Array(200 - encoding.length).fill(0).concat(encoding);
        } else if (encoding.length > 200) {
          encoding.splice(0, encoding.length - 200);
        }
        return encoding;
      }

    extract(details: browser.WebRequest.OnBeforeSendHeadersDetailsType): number[] {
        let features: number[] = [];
        features = features.concat(this._encodeUrl(details.url));
        features.push(Extractor.methods.indexOf(details.method) + 1);
        features.push(Extractor.types.indexOf(details.type) + 1);
        features.push(details.thirdParty ? 1 : 0);
        return features;
    }
}


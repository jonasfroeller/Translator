import {Injectable} from '@angular/core';
import {catchError, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {APIs} from "./types";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private http: HttpClient) {
  }

  private static readonly MYMEMORY_API_URL = (phrase: string, from: string = "en", to: string = "de") => {
    const encodedPhrase = encodeURIComponent(phrase);
    const requestURL = `https://api.mymemory.translated.net/get?q=${encodedPhrase}&langpair=${from}|${to}`;
    console.log(requestURL);
    return requestURL;
  }

  private static readonly DEEPL_API_URL = (phrase: string, from: string = "EN", to: string = "DE") => {
    const encodedPhrase = encodeURIComponent(phrase);
    const requestURL = `https://rest-translator.j-froeller.workers.dev/api/deepl?text=${encodedPhrase}&source_lang=${from}&target_lang=${to}`;
    console.log(requestURL);
    return requestURL;
  }

  private static readonly M2M100_1_2B_API_URL = (phrase: string, from: string = "english", to: string = "german") => {
    const encodedPhrase = encodeURIComponent(phrase);
    const requestURL = `https://rest-translator.j-froeller.workers.dev/api/m2m100-1.2b?text=${encodedPhrase}&source_lang=${from}&target_lang=${to}`;
    console.log(requestURL);
    return requestURL;
  }

  private getTranslationURL(api: string, text: string, from: string, to: string): string {
    switch (api) {
      case "mymemory":
        return TranslationService.MYMEMORY_API_URL(text, from, to);
      case "deepl":
        return TranslationService.DEEPL_API_URL(text, from, to);
      case "m2m100-1.2b":
        return TranslationService.M2M100_1_2B_API_URL(text, from, to);
      default:
        throw new Error("Invalid API selected");
    }
  }

  translate<T>(api: APIs, phrase: string, from: string, to: string): Observable<T | null> {
    console.log(`Translating '${phrase}' from '${from}' to '${to}'.`)

    const translationURL = this.getTranslationURL(api, phrase, from, to);
    return this.http.get<T>(translationURL)
      .pipe(
        tap(response => console.log(response)),
        catchError(async (error) => {
          console.error(error);
          return null;
        })
      );
  }
}

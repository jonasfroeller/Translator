import {Injectable} from '@angular/core';
import {catchError, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

type DeeplSourceLanguages = "BG" | "CS" | "DA" | "DE" | "EL" | "EN" | "ES" | "ET" | "FI" | "FR" | "HU" | "ID" | "IT" | "JA" | "KO" | "LT" | "LV" | "NB" | "NL" | "PL" | "PT" | "RO" | "RU" | "SK" | "SL" | "SV" | "TR" | "UK" | "ZH";
type DeeplTargetLanguages = "BG" | "CS" | "DA" | "DE" | "EL" | "EN-GB" | "EN-US" | "ES" | "ET" | "FI" | "FR" | "HU" | "ID" | "IT" | "JA" | "KO" | "LT" | "LV" | "NB" | "NL" | "PL" | "PT-BR" | "PT-PT" | "RO" | "RU" | "SK" | "SL" | "SV" | "TR" | "UK" | "ZH";
export interface Deepl_TranslationResponse { // autodetect and set source lang returns the same response
  "translations": [
    {
      "detected_source_language": DeeplSourceLanguages,
      "text": string
    }
  ]
}

export interface M2M100_1_2B_TranslationResponse {
  translated_text: string
}

export interface TranslationResponse {
  responseData: {
    translatedText: string,
    match: number
  },
  quotaFinished: boolean,
  mtLangSupported: any,
  responseDetails: string,
  responseStatus: number,
  responderId: any,
  exception_code: any,
  matches: [
    {
      id: string,
      segment: string,
      translation: string,
      source: string,
      target: string,
      quality: number,
      reference: any,
      "usage-count": 2,
      subject: string,
      "created-by": string,
      "last-updated-by": string,
      "create-date": string,
      "last-update-date": string,
      match: number
    }
  ]
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private http: HttpClient) {
  }

  private static readonly API_URL = (phrase: string, from: string = "en", to: string = "de") => {
    const encodedPhrase = encodeURIComponent(phrase);
    const requestURL = `https://api.mymemory.translated.net/get?q=${encodedPhrase}&langpair=${from}|${to}`;
    console.log(requestURL);
    return requestURL;
  }

  translate(phrase: string, from: string = "en", to: string = "de"): Observable<TranslationResponse | null> {
    console.log(`Translating '${phrase}' from '${from}' to '${to}'.`)

    return this.http.get<TranslationResponse>(TranslationService.API_URL(phrase, from, to))
      .pipe(
        tap(response => console.log(response)),
        catchError(async (error) => {
          console.error(error);
          return null;
        })
      );
  }
}

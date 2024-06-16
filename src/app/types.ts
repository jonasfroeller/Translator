export type APIs = "mymemory" | "deepl" | "m2m100-1.2b";

export type DeeplSourceLanguages = "BG" | "CS" | "DA" | "DE" | "EL" | "EN" | "ES" | "ET" | "FI" | "FR" | "HU" | "ID" | "IT" | "JA" | "KO" | "LT" | "LV" | "NB" | "NL" | "PL" | "PT" | "RO" | "RU" | "SK" | "SL" | "SV" | "TR" | "UK" | "ZH";
export type DeeplTargetLanguages = "BG" | "CS" | "DA" | "DE" | "EL" | "EN-GB" | "EN-US" | "ES" | "ET" | "FI" | "FR" | "HU" | "ID" | "IT" | "JA" | "KO" | "LT" | "LV" | "NB" | "NL" | "PL" | "PT-BR" | "PT-PT" | "RO" | "RU" | "SK" | "SL" | "SV" | "TR" | "UK" | "ZH";
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

export interface MYMEMORY_TranslationResponse {
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

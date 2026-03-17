import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Deepl_TranslationResponse, M2M100_1_2B_TranslationResponse, MYMEMORY_TranslationResponse} from "../types";

@Component({
  selector: 'app-translation-output',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './translation-output.component.html',
  styleUrl: './translation-output.component.scss'
})
export class TranslationOutputComponent implements OnChanges, OnDestroy {
  @Input() translatedText!: MYMEMORY_TranslationResponse | M2M100_1_2B_TranslationResponse | Deepl_TranslationResponse | null;
  @Input() isLoading: boolean = false;

  extractedTranslation: string = "";
  translatedTextAsJsonString: string = "";
  showRawJson: boolean = false;
  matchQuality: number | null = null;
  detectedSource: string | null = null;
  isCopied: boolean = false;
  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(changes: SimpleChanges) {
    const translatedText = changes['translatedText'];
    if (translatedText && translatedText.currentValue) {
      const response = translatedText.currentValue;
      this.extractTranslation(response);
      this.translatedTextAsJsonString = this.syntaxHighlight(JSON.stringify(response, null, 2));
    }
  }

  private extractTranslation(response: any): void {
    // MyMemory response
    if (response.responseData && response.responseData.translatedText) {
      this.extractedTranslation = response.responseData.translatedText;
      this.matchQuality = response.responseData.match ? Math.round(response.responseData.match * 100) : null;
      this.detectedSource = null;
      return;
    }

    // DeepL response
    if (response.translations && response.translations.length > 0) {
      this.extractedTranslation = response.translations[0].text;
      this.detectedSource = response.translations[0].detected_source_language || null;
      this.matchQuality = null;
      return;
    }

    // M2M100 response
    if (response.translated_text) {
      this.extractedTranslation = response.translated_text;
      this.matchQuality = null;
      this.detectedSource = null;
      return;
    }

    // Fallback
    this.extractedTranslation = JSON.stringify(response);
  }

  toggleRawJson(): void {
    this.showRawJson = !this.showRawJson;
  }

  ngOnDestroy(): void {
    if (this.copyResetTimer) {
      clearTimeout(this.copyResetTimer);
    }
  }

  async copyTranslation(): Promise<void> {
    if (this.extractedTranslation) {
      try {
        await navigator.clipboard.writeText(this.extractedTranslation);
        this.isCopied = true;
        if (this.copyResetTimer) {
          clearTimeout(this.copyResetTimer);
        }
        this.copyResetTimer = setTimeout(() => {
          this.isCopied = false;
        }, 1400);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }

  syntaxHighlight(json: string): string {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }
}

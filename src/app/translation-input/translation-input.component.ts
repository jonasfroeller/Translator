import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslationService} from "../translation.service";
import {FormsModule} from "@angular/forms";
import {TranslationOutputComponent} from "../translation-output/translation-output.component";
import {APIs, Deepl_TranslationResponse, M2M100_1_2B_TranslationResponse, MYMEMORY_TranslationResponse} from "../types";

@Component({
  selector: 'app-translation-input',
  standalone: true,
  imports: [
    FormsModule,
    TranslationOutputComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './translation-input.component.html',
  styleUrl: './translation-input.component.scss'
})
export class TranslationInputComponent {
  textToTranslate: string = "";
  translatedText: MYMEMORY_TranslationResponse | M2M100_1_2B_TranslationResponse | Deepl_TranslationResponse | null = null;
  selectedAPI: APIs = "mymemory";
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = "";

  readonly apiOptions: { value: APIs; label: string; description: string; category: string }[] = [
    { value: "mymemory", label: "MyMemory", description: "Community + Machine", category: "community" },
    { value: "deepl", label: "DeepL", description: "Neural MT", category: "ai" },
    { value: "m2m100-1.2b", label: "M2M100", description: "Meta AI", category: "ai" },
  ];

  constructor(private translationService: TranslationService) {
  }

  selectAPI(api: APIs) {
    this.selectedAPI = api;
  }

  get characterCount(): number {
    return this.textToTranslate.length;
  }

  get canTranslate(): boolean {
    return this.textToTranslate.trim().length > 0 && !this.isLoading;
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (this.canTranslate) {
        this.translate();
      }
    }
  }

  translate() {
    if (!this.canTranslate) return;

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    if (this.selectedAPI === "mymemory") {
      this.translateWithMYMEMORY();
    } else if (this.selectedAPI === "deepl") {
      this.translateWithDeepL();
    } else if (this.selectedAPI === "m2m100-1.2b") {
      this.translateWithM2M100();
    }
  }

  private handleTranslationResult(r: any) {
    this.isLoading = false;
    if (r) {
      this.translatedText = r;
    } else {
      this.hasError = true;
      this.errorMessage = "Translation failed. Please try again.";
    }
  }

  translateWithMYMEMORY() {
    this.translationService.translate<MYMEMORY_TranslationResponse>("mymemory", this.textToTranslate, "en", "de").subscribe(
      (r) => this.handleTranslationResult(r)
    );
  }

  translateWithDeepL() {
    this.translationService.translate<Deepl_TranslationResponse>("deepl", this.textToTranslate, "EN", "DE").subscribe(
      (r) => this.handleTranslationResult(r)
    );
  }

  translateWithM2M100() {
    this.translationService.translate<M2M100_1_2B_TranslationResponse>("m2m100-1.2b", this.textToTranslate, "english", "german").subscribe(
      (r) => this.handleTranslationResult(r)
    );
  }
}

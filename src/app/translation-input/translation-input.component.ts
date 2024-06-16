import {Component} from '@angular/core';
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
  templateUrl: './translation-input.component.html',
  styleUrl: './translation-input.component.scss'
})
export class TranslationInputComponent {
  textToTranslate: string = "";
  translatedText: MYMEMORY_TranslationResponse | M2M100_1_2B_TranslationResponse | Deepl_TranslationResponse | null = null;
  selectedAPI: APIs = "mymemory"

  constructor(private translationService: TranslationService) {
  }

  translate() {
    if (this.selectedAPI === "mymemory") {
      console.log("using", "mymemory");
      this.translateWithMYMEMORY();
    } else if (this.selectedAPI === "deepl") {
      console.log("using", "deepl");
      this.translateWithDeepL();
    } else if (this.selectedAPI === "m2m100-1.2b") {
      console.log("using", "m2m100-1.2b");
      this.translateWithM2M100();
    }
  }

  translateWithMYMEMORY() {
    if (this.textToTranslate.trim().length > 0) {
      this.translationService.translate<MYMEMORY_TranslationResponse>("mymemory", this.textToTranslate, "en", "de").subscribe(
        (r) => {
          if (r) {
            console.log("translateWithMYMEMORY()", r);
            this.translatedText = r;
          }
        }
      );
    }
  }

  translateWithDeepL() {
    if (this.textToTranslate.trim().length > 0) {
      this.translationService.translate<Deepl_TranslationResponse>("deepl", this.textToTranslate, "EN", "DE").subscribe(
        (r) => {
          if (r) {
            console.log("translateWithDeepL()", r);
            this.translatedText = r;
          }
        }
      );
    }
  }

  translateWithM2M100() {
    if (this.textToTranslate.trim().length > 0) {
      this.translationService.translate<M2M100_1_2B_TranslationResponse>("m2m100-1.2b", this.textToTranslate, "english", "german").subscribe(
        (r) => {
          if (r) {
            console.log("translateWithM2M100()", r);
            this.translatedText = r;
          }
        }
      );
    }
  }
}

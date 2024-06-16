import {Component} from '@angular/core';
import {TranslationResponse, TranslationService} from "../translation.service";
import {FormsModule} from "@angular/forms";
import {TranslationOutputComponent} from "../translation-output/translation-output.component";

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
  translatedText: TranslationResponse | null = null;
  selectedAPI: "mymemory" | "deepl" | "m2m100-1.2b" = "mymemory"

  constructor(private translationService: TranslationService) {
  }

  translate() {
    if (this.textToTranslate.trim().length > 0) {
      this.translationService.translate(this.textToTranslate, "en", "de").subscribe(
        (response) => {
          this.translatedText = response;
        }
      );
    }
  }
}

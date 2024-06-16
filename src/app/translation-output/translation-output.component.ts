import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Deepl_TranslationResponse, M2M100_1_2B_TranslationResponse, MYMEMORY_TranslationResponse} from "../types";

@Component({
  selector: 'app-translation-output',
  standalone: true,
  imports: [],
  templateUrl: './translation-output.component.html',
  styleUrl: './translation-output.component.scss'
})
export class TranslationOutputComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() translatedText!: MYMEMORY_TranslationResponse | M2M100_1_2B_TranslationResponse | Deepl_TranslationResponse | null;
  translatedTextAsJsonString: string = "";

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes['translatedText']", changes['translatedText'])

    const translatedText = changes['translatedText'];
    if (translatedText && translatedText.currentValue) {
      console.log(translatedText.currentValue)
      this.translatedTextAsJsonString = this.syntaxHighlight(JSON.stringify(translatedText.currentValue, null, 2));
    }
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
  }

  syntaxHighlight(json: string) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
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

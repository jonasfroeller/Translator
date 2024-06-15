import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TranslationResponse} from "../translation.service";

@Component({
  selector: 'app-translation-output',
  standalone: true,
  imports: [],
  templateUrl: './translation-output.component.html',
  styleUrl: './translation-output.component.scss'
})
export class TranslationOutputComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() translatedText!: TranslationResponse | null;
  translatedTextAsJsonString: string = "";

  ngOnChanges(changes: SimpleChanges) {
    if (changes['translatedText']) {
      this.translatedTextAsJsonString = this.syntaxHighlight(JSON.stringify(changes['translatedText'].currentValue, null, 2));
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

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslationInputComponent} from './translation-input.component';

describe('TranslationInputComponent', () => {
  let component: TranslationInputComponent;
  let fixture: ComponentFixture<TranslationInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TranslationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

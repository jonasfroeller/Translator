import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslationOutputComponent} from './translation-output.component';

describe('TranslationOutputComponent', () => {
  let component: TranslationOutputComponent;
  let fixture: ComponentFixture<TranslationOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationOutputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TranslationOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

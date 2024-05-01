import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAudioComponent } from './form-audio.component';

describe('FormAudioComponent', () => {
  let component: FormAudioComponent;
  let fixture: ComponentFixture<FormAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAudioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

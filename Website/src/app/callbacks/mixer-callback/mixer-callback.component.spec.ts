import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerCallbackComponent } from './mixer-callback.component';

describe('MixerCallbackComponent', () => {
  let component: MixerCallbackComponent;
  let fixture: ComponentFixture<MixerCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixerCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixerCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

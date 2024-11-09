import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartYx1Component } from './chart-yx1.component';

describe('ChartYx1Component', () => {
  let component: ChartYx1Component;
  let fixture: ComponentFixture<ChartYx1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartYx1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartYx1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

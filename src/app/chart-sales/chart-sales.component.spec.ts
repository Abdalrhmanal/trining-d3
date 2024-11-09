import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSalesComponent } from './chart-sales.component';

describe('ChartSalesComponent', () => {
  let component: ChartSalesComponent;
  let fixture: ComponentFixture<ChartSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumnsComponent } from './chart-columns.component';

describe('ChartColumnsComponent', () => {
  let component: ChartColumnsComponent;
  let fixture: ComponentFixture<ChartColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartColumnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

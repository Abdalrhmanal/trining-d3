import { Component } from '@angular/core';
import { ChartColumnsComponent } from "./chart-columns/chart-columns.component";
import { ChartCircleComponent } from "./chart-circle/chart-circle.component";
import { ChartYx1Component } from "./chart-yx1/chart-yx1.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { LineChart2Component } from "./line-chart2/line-chart2.component";
import { ChartSalesComponent } from "./chart-sales/chart-sales.component";
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [ChartColumnsComponent , ChartCircleComponent, ChartYx1Component, LineChartComponent, LineChart2Component, ChartSalesComponent]
})
export class AppComponent {
  title = 'triningd3';
 
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { SalesDataService, SalesData, YearData, MonthData, DayData } from './sales-data.service';

@Component({
  selector: 'app-chart-sales',
  standalone: true,
  templateUrl: './chart-sales.component.html',
  styleUrls: ['./chart-sales.component.scss']
})
export class ChartSalesComponent implements OnInit {
  private data: SalesData | undefined;
  private svg: any;
  private width = 650;
  private height = 400;
  private margin = 80;
  private path: string[] = []; 

  @ViewChild('codeBox') codeBox: ElementRef | undefined;

  constructor(
    private elRef: ElementRef,
    private salesDataService: SalesDataService
  ) {}

  ngOnInit(): void {
    this.salesDataService.loadSalesData().subscribe((data) => {
      this.data = data;
      this.path = ['Years'];
      this.createSvg();
      this.drawChart('year');
    });
  }

  private createSvg(): void {
    d3.select(this.elRef.nativeElement.querySelector('#chart')).selectAll('*').remove();
    d3.select(this.elRef.nativeElement.querySelector('#breadcrumb')).selectAll('*').remove();

    this.svg = d3.select(this.elRef.nativeElement.querySelector('#chart'))
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);

    this.addBreadcrumb();
  }

  private addBreadcrumb(): void {
    const breadcrumb = d3.select(this.elRef.nativeElement.querySelector('#breadcrumb'));
    breadcrumb.selectAll('*').remove();

    this.path.forEach((part, index) => {
      const isLast = index === this.path.length - 1;

      breadcrumb.append('span')
        .text(part)
        .style('cursor', !isLast ? 'pointer' : 'default')
        .style('color', !isLast ? '#00ccff' : 'white')
        .on('click', () => {
          if (index < this.path.length - 1) {
            this.path = this.path.slice(0, index + 1);
            this.drawChart(this.getLevel());
          }
        });

      if (!isLast) {
        breadcrumb.append('span')
          .text(' > ')
          .style('color', 'white');
      }
    });
  }

  private getLevel(): 'year' | 'month' | 'day' {
    return this.path.length === 1 ? 'year' : this.path.length === 2 ? 'month' : 'day';
  }

  private prepareData(level: 'year' | 'month' | 'day'): { xDomain: string[], sales: number[] } {
    if (!this.data) {
      return { xDomain: [], sales: [] };
    }

    if (level === 'year') {
      const xDomain = this.data.years.map(year => year.year.toString());
      const sales = this.data.years.map(year =>
        year.months.reduce((yearSum, month) =>
          yearSum + month.days.reduce((monthSum, day) => monthSum + day.sales, 0)
        , 0)
      );
      return { xDomain, sales };
    } else if (level === 'month') {
      const year = this.data.years.find(y => y.year.toString() === this.path[1]);
      if (!year) return { xDomain: [], sales: [] };

      const xDomain = year.months.map(month => month.month);
      const sales = year.months.map(month =>
        month.days.reduce((monthSum, day) => monthSum + day.sales, 0)
      );
      return { xDomain, sales };
    } else {
      const year = this.data.years.find(y => y.year.toString() === this.path[1]);
      const month = year?.months.find(m => m.month === this.path[2]);
      if (!month) return { xDomain: [], sales: [] };

      const xDomain = month.days.map(day => day.day.toString());
      const sales = month.days.map(day => day.sales);
      return { xDomain, sales };
    }
  }

  private drawChart(level: 'year' | 'month' | 'day'): void {
    this.createSvg();

    const { xDomain, sales } = this.prepareData(level);
    if (xDomain.length === 0 || sales.length === 0) {
      return;
    }

    const x = d3.scaleBand().domain(xDomain).range([0, this.width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(sales) as number]).range([this.height, 0]);
    const color = this.getColorScale(level, xDomain.length);

    this.drawAxes(x, y, level);
    this.drawBars(x, y, xDomain, sales, color, level);
  }

  private drawAxes(x: d3.ScaleBand<string>, y: d3.ScaleLinear<number, number>, level: string): void {
    const xAxis = d3.axisBottom(x);
    if (level !== 'year') {
      xAxis.tickFormat(d => this.formatDate(d, level));
    }

    this.svg.append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${this.height})`)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .style("fill", "white")
      .attr("transform", level !== 'year' ? "rotate(-45)" : "");

    this.svg.append('g')
      .call(d3.axisLeft(y).ticks(10))
      .selectAll("text")
      .style("fill", "white");
  }

  private drawBars(
    x: d3.ScaleBand<string>,
    y: d3.ScaleLinear<number, number>,
    xDomain: string[],
    sales: number[],
    color: d3.ScaleSequential<string>,
    level: string
  ): void {
    this.svg.selectAll('rect')
      .data(xDomain)
      .enter()
      .append('rect')
      .attr('x', (d: string) => x(d) as number)
      .attr('width', x.bandwidth())
      .attr('y', this.height)
      .attr('height', 0)
      .attr('fill', (d: string, i: number) => color(i))
      .on('mouseover', (event: MouseEvent, d: string) => this.onMouseOver(event))
      .on('mouseout', (event: MouseEvent, d: string) => this.onMouseOut(event))
      .on('click', (event: MouseEvent, d: string) => this.onClick(this.getLevel() as 'month' | 'year', d))
      .transition()
      .duration(800)
      .attr('y', (d: string, i: number) => y(sales[i]))
      .attr('height', (d: string, i: number) => this.height - y(sales[i]))
      .end()
      .then(() => {
        if (level === 'year' || level === 'month') {
          this.svg.selectAll('.label')
            .data(xDomain)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', (d: string) => (x(d) as number) + x.bandwidth() / 2)
            .attr('y', (d: string, i: number) => y(sales[i]) - 5)
            .attr('text-anchor', 'middle')
            .style('fill', 'red')
            .style('font-size', '12px')
            .text((d: string, i: number) => `${sales[i]}`);
        }
      });
  }

  private getColorScale(level: string, length: number): d3.ScaleSequential<string> {
    switch (level) {
      case 'year':
        return d3.scaleSequential(d3.interpolateBlues).domain([0, length]);
      case 'month':
        return d3.scaleSequential(d3.interpolateGreens).domain([0, length]);
      case 'day':
        return d3.scaleSequential(d3.interpolateOranges).domain([0, length]);
      default:
        return d3.scaleSequential(d3.interpolateBlues).domain([0, length]);
    }
  }

  private formatDate(value: string, level: string): string {
    if (level === 'month') {
      return `${this.path[1]}-${value.padStart(2, '0')}`;
    } else if (level === 'day') {
      return `${this.path[1]}-${this.path[2]}-${value.padStart(2, '0')}`;
    }
    return value;
  }

  private onMouseOver(event: MouseEvent): void {
    const target = d3.select(event.currentTarget as SVGRectElement);
    target.attr('data-original-color', target.attr('fill')); // Save original color
    target.attr('fill', '#ffffff'); // Set to white on hover
  }

  private onMouseOut(event: MouseEvent): void {
    const target = d3.select(event.currentTarget as SVGRectElement);
    const originalColor = target.attr('data-original-color');
    target.attr('fill', originalColor); // Restore original color
  }

  private onClick(level: 'year' | 'month', d: string): void {
    if (level === 'year') {
      this.path.push(d);
      this.drawChart('month');
    } else if (level === 'month') {
      this.path.push(d);
      this.drawChart('day');
    }
  }
}

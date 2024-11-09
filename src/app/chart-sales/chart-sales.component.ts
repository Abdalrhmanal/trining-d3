import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { SalesDataService } from './sales-data.service';

@Component({
  selector: 'app-chart-sales',
  standalone: true,
  imports: [],
  templateUrl: './chart-sales.component.html',
  styleUrls: ['./chart-sales.component.scss']
})

export class ChartSalesComponent implements OnInit {
  private data: any;
  private svg: any;
  private width = 650;
  private height = 400;
  private margin = 80;
  private currentLevel: 'year' | 'month' | 'day' = 'year';
  private selectedYear: string = '';
  private selectedMonth: string = '';

  @ViewChild('codeBox') codeBox: ElementRef | undefined;

  constructor(
    private elRef: ElementRef,
    private salesDataService: SalesDataService
  ) { }

  ngOnInit(): void {
    this.salesDataService.loadSalesData().subscribe((data) => {
      this.data = data;
      this.createSvg();
      this.drawYearChart();
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

    let path = '';
    if (this.currentLevel === 'year') {
      path = 'Years';
    } else if (this.currentLevel === 'month') {
      path = `Years > ${this.selectedYear}`;
    } else if (this.currentLevel === 'day') {
      path = `Years > ${this.selectedYear} > ${this.selectedMonth}`;
    }

    const parts = path.split(' > ');

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;

      breadcrumb.append('span')
        .text(part)
        .style('cursor', !isLast ? 'pointer' : 'default')
        .style('color', !isLast ? '#00ccff' : 'white')
        .on('click', () => {
          if (index === 0) {
            this.drawYearChart();
          } else if (index === 1) {
            this.drawMonthChart(this.selectedYear);
          }
        });

      if (!isLast) {
        breadcrumb.append('span')
          .text(' > ')
          .style('color', 'white');
      }
    });
  }

  private drawYearChart(): void {
    this.currentLevel = 'year';
    this.createSvg();
    const years = Object.keys(this.data);
    const sales = years.map(year =>
      d3.sum(Object.values(this.data[year]).map((month: any) =>
        d3.sum(Object.values(month))
      ))
    );

    const x = d3.scaleBand().domain(years).range([0, this.width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(sales) as number]).range([this.height, 0]);

    const colors = ['#00ccff', '#ff9933', '#66ff66', '#ff6666', '#cc66ff'];

    this.svg.append('g')
      .call(d3.axisBottom(x))
      .attr('transform', `translate(0, ${this.height})`)
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "white");

    this.svg.append('g')
      .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "white");

    this.svg.selectAll('rect')
      .data(years)
      .enter()
      .append('rect')
      .attr('x', (d: string) => x(d) as number)
      .attr('width', x.bandwidth())
      .attr('y', this.height)
      .attr('height', 0)
      .attr('fill', (d: string, i: number) => colors[i % colors.length])
      .on('mouseover', (event: MouseEvent, d: string) => {
        d3.select(event.currentTarget as SVGRectElement).attr('fill', '#ffffff');
      })
      .on('mouseout', (event: MouseEvent, d: string) => {
        d3.select(event.currentTarget as SVGRectElement).attr('fill', colors[years.indexOf(d) % colors.length]);
      })
      .on('click', (event: MouseEvent, year: string) => {
        this.selectedYear = year;
        this.drawMonthChart(year);
      })
      .transition()
      .duration(800)
      .attr('y', (d: string, i: number) => y(sales[i]))
      .attr('height', (d: string, i: number) => this.height - y(sales[i]));

    this.svg.selectAll("text.label")
      .data(sales)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d: any, i: number) => x(years[i]) as number + x.bandwidth() / 2)
      .attr("y", (d: any) => y(d) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "red")
      .text((d: any) => `${d.toFixed(1)}%`);
  }

  private drawMonthChart(year: string): void {
    this.currentLevel = 'month';
    this.createSvg();
    const months = Object.keys(this.data[year]);
    const sales = months.map(month => d3.sum(Object.values(this.data[year][month])));

    const x = d3.scaleBand().domain(months).range([0, this.width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(sales) as number]).range([this.height, 0]);
    const color = d3.scaleSequential(d3.interpolateGreens).domain([0, months.length]);

    const formatMonth = (month: string) => `${year}-${month.padStart(2, '0')}`;

    this.svg.append('g')
      .call(d3.axisBottom(x).tickFormat((d: string) => formatMonth(d)))
      .attr('transform', `translate(0, ${this.height})`)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .style("fill", "white")
      .attr("transform", "rotate(-45)");

    this.svg.append('g')
      .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`))
      .selectAll("text")
      .style("fill", "white");

    this.svg.selectAll('rect')
      .data(months)
      .enter()
      .append('rect')
      .attr('x', (d: string) => x(d) as number)
      .attr('width', x.bandwidth())
      .attr('y', this.height)
      .attr('height', 0)
      .attr('fill', (d: string, i: number) => color(i))
      .on('mouseover', (event: MouseEvent, d: string) => {
        d3.select(event.currentTarget as SVGRectElement).attr('fill', '#ffffff');
      })
      .on('mouseout', (event: MouseEvent, d: string) => {
        d3.select(event.currentTarget as SVGRectElement).attr('fill', color(months.indexOf(d)));
      })
      .on('click', (event: MouseEvent, month: string) => {
        this.selectedMonth = month;
        this.drawDayChart(year, month);
      })
      .transition()
      .duration(800)
      .attr('y', (d: string, i: number) => y(sales[i]))
      .attr('height', (d: string, i: number) => this.height - y(sales[i]));
  }

  private drawDayChart(year: string, month: string): void {
    this.currentLevel = 'day';
    this.createSvg();
    const days = Object.keys(this.data[year][month]);
    const sales = days.map(day => this.data[year][month][day]);

    const x = d3.scaleBand().domain(days).range([0, this.width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(sales) as number]).range([this.height, 0]);
    const color = d3.scaleSequential(d3.interpolateOranges).domain([0, days.length]);

    const formatDate = (day: string) => `${year}-${month}-${day.padStart(2, '0')}`;

    this.svg.append('g')
      .call(d3.axisBottom(x).tickFormat((d: string) => formatDate(d)))
      .attr('transform', `translate(0, ${this.height})`)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .style("fill", "white")
      .attr("transform", "rotate(-45)");

    this.svg.append('g')
      .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`))
      .selectAll("text")
      .style("fill", "white");

    this.svg.selectAll('rect')
      .data(days)
      .enter()
      .append('rect')
      .attr('x', (d: string) => x(d) as number)
      .attr('width', x.bandwidth())
      .attr('y', this.height)
      .attr('height', 0)
      .attr('fill', (d: string, i: number) => color(i))
      .on('mouseover', (event: MouseEvent, d: string) => {
        d3.select(event.currentTarget as SVGRectElement).attr('fill', '#ffffff');
      })
      .on('mouseout', (event: MouseEvent, d: string) => {
        d3.select(event.currentTarget as SVGRectElement).attr('fill', color(days.indexOf(d)));
      })
      .transition()
      .duration(800)
      .attr('y', (d: string, i: number) => y(sales[i]))
      .attr('height', (d: string, i: number) => this.height - y(sales[i]));
  }
}

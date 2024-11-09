import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  private data = [
    { date: new Date(2023, 0, 1), value: 60 },
    { date: new Date(2023, 1, 1), value: 120 },
    { date: new Date(2023, 2, 1), value: 150 },
    { date: new Date(2023, 4, 1), value: 180 },
    { date: new Date(2023, 6, 1), value: 80 },
    { date: new Date(2023, 7, 1), value: 130 }
  ];

  private svg: any;
  private margin = { top: 20, right: 30, bottom: 30, left: 40 };
  private width = 700 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  ngOnInit(): void {
    this.createSvg();
    this.drawChart();
  }

  private createSvg(): void {
    this.svg = d3.select("div#chart")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private drawChart(): void {
    // إعداد المحاور
    const x = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.date) as [Date, Date])
      .range([0, this.width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value) || 200])
      .range([this.height, 0]);

    // رسم شبكة الخلفية
    this.svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x).ticks(9).tickSize(-this.height).tickFormat(() => ''));

    this.svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(9).tickSize(-this.width).tickFormat(() => ''));

    // رسم المحور X و Y
    this.svg.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x).ticks(9).tickFormat((date: Date | d3.NumberValue, index: number) => {
        return d3.timeFormat("%B")(date as Date);
      }));

    this.svg.append("g")
      .call(d3.axisLeft(y));

    // رسم الخط
    const line = d3.line<{ date: Date; value: number }>()
      .x(d => x(d.date))
      .y(d => y(d.value));

    this.svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // رسم النقاط
    this.svg.selectAll("dot")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("cx", (d: { date: Date; value: number }) => x(d.date))
      .attr("cy", (d: { date: Date; value: number }) => y(d.value))
      .attr("r", 5)
      .style("fill", (d: { date: Date; value: number }, i: number) => i === 1 ? "green" : "red"); // النقطة الثانية باللون الأخضر
  }
}

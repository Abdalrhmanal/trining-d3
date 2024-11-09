import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart2',
  standalone: true,
  templateUrl: './line-chart2.component.html',
  styleUrls: ['./line-chart2.component.scss']
})
export class LineChart2Component implements OnInit {
  private data = [
    { x: 0, y: 10 },
    { x: 1, y: 20 },
    { x: 2, y: 15 },
    { x: 3, y: 25 },
    { x: 4, y: 30 },
    { x: 5, y: 28 },
    { x: 6, y: 35 },
    { x: 7, y: 40 },
    { x: 8, y: 37 },
    { x: 9, y: 50 }
  ];

  private svg: any;
  private margin = { top: 20, right: 30, bottom: 40, left: 40 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.createSvg();
    this.drawChart();
  }

  private createSvg(): void {
    this.svg = d3.select(this.elementRef.nativeElement).select("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }

  private drawChart(): void {
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.x)!])
      .range([0, this.width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.y)!])
      .range([this.height, 0]);

    const line = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    this.svg.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(xScale));

    this.svg.append("g")
      .call(d3.axisLeft(yScale));

    this.svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    this.svg.selectAll("circle")
    .data(this.data)
    .enter()
    .append("circle")
    .attr("cx", (d: { x: number; y: number }) => xScale(d.x)) 
    .attr("cy", (d: { x: number; y: number }) => yScale(d.y)) 
    .attr("r", 5)
    .attr("fill", "red");
  
  }
}

import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-columns',
  standalone: true,
  imports: [],
  templateUrl: './chart-columns.component.html',
  styleUrls: ['./chart-columns.component.scss']
})
export class ChartColumnsComponent implements OnInit {
  data: number[] = [30, 86, 168, 281, 303, 365];
  svgWidth = 600;
  svgHeight = 400;
  margin = { top: 20, right: 30, bottom: 40, left: 40 };
  width = this.svgWidth - this.margin.left - this.margin.right;
  height = this.svgHeight - this.margin.top - this.margin.bottom;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    
    const element = this.elementRef.nativeElement;
    const svg = d3.select(element).select("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

   
    const xScale = d3.scaleBand()
      .domain(this.data.map((_, i) => i.toString()))
      .range([0, this.width])
      .padding(0.1);

    // Y
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data) || 0])
      .range([this.height, 0]);

    // X
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(xScale).tickFormat((d, i) => `Item ${i + 1}`))
      .selectAll("text")
      .attr("class", "axis-label");

    // create Y
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale).ticks(10))
      .selectAll("text")
      .attr("class", "axis-label");

    svg.selectAll(".bar")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("class", "bar") 
      .attr("x", (_, i) => xScale(i.toString()) || 0)
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => this.height - yScale(d))
      .style("fill", "steelblue")
      .on("mouseover", function () {
        d3.select(this).style("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this).style("fill", "steelblue");
      });

  }
}

import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-yx1',
  standalone: true,
  imports: [],
  templateUrl: './chart-yx1.component.html',
  styleUrls: ['./chart-yx1.component.scss']
})
export class ChartYx1Component implements OnInit {
  private data = [
    { year: 1880, Amanda: 50, Ashley: 10, Betty: 30, Deborah: 0, Dorothy: 40, Helen: 150, Linda: 0, Patricia: 0 },
    { year: 1890, Amanda: 120, Ashley: 20, Betty: 70, Deborah: 0, Dorothy: 90, Helen: 200, Linda: 0, Patricia: 0 },
    { year: 1900, Amanda: 300, Ashley: 25, Betty: 100, Deborah: 0, Dorothy: 250, Helen: 300, Linda: 0, Patricia: 0 },
    { year: 1910, Amanda: 500, Ashley: 60, Betty: 200, Deborah: 0, Dorothy: 400, Helen: 500, Linda: 0, Patricia: 0 },
    { year: 1920, Amanda: 800, Ashley: 80, Betty: 400, Deborah: 0, Dorothy: 600, Helen: 1000, Linda: 0, Patricia: 0 },
    { year: 1930, Amanda: 1200, Ashley: 100, Betty: 500, Deborah: 0, Dorothy: 800, Helen: 1200, Linda: 0, Patricia: 0 },
    { year: 1940, Amanda: 1500, Ashley: 200, Betty: 700, Deborah: 100, Dorothy: 1100, Helen: 1500, Linda: 0, Patricia: 0 },
    { year: 1950, Amanda: 2000, Ashley: 400, Betty: 1200, Deborah: 300, Dorothy: 1300, Helen: 1800, Linda: 1000, Patricia: 500 },
    { year: 1960, Amanda: 2200, Ashley: 500, Betty: 1300, Deborah: 800, Dorothy: 1500, Helen: 1900, Linda: 1500, Patricia: 1000 },
    { year: 1970, Amanda: 2500, Ashley: 800, Betty: 1400, Deborah: 1500, Dorothy: 1700, Helen: 1800, Linda: 2000, Patricia: 1200 },
    { year: 1980, Amanda: 3000, Ashley: 2000, Betty: 1000, Deborah: 800, Dorothy: 500, Helen: 1000, Linda: 3000, Patricia: 2500 },
    { year: 1990, Amanda: 3500, Ashley: 3000, Betty: 500, Deborah: 300, Dorothy: 400, Helen: 500, Linda: 2000, Patricia: 4000 },
    { year: 2000, Amanda: 2500, Ashley: 4000, Betty: 200, Deborah: 100, Dorothy: 100, Helen: 200, Linda: 1000, Patricia: 3500 },
    { year: 2010, Amanda: 1000, Ashley: 2000, Betty: 50, Deborah: 50, Dorothy: 80, Helen: 100, Linda: 300, Patricia: 2000 },
    { year: 2020, Amanda: 500, Ashley: 1000, Betty: 10, Deborah: 10, Dorothy: 30, Helen: 50, Linda: 100, Patricia: 1000 },
  ];


  private svg: any;
  private margin = { top: 20, right: 30, bottom: 30, left: 40 };
  private width = 900 - this.margin.left - this.margin.right;
  private height = 500 - this.margin.top - this.margin.bottom;

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
    const keys = ["Amanda", "Ashley", "Betty", "Deborah", "Dorothy", "Helen", "Linda", "Patricia"];
    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(["#ff5722", "#4caf50", "#2196f3", "#e91e63", "#ffeb3b", "#f48fb1", "#9575cd", "#9e9d24"]);

    const stackedData = d3.stack<{ year: number }>()
      .keys(keys)
      (this.data);

    const x = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.year) as [number, number])
      .range([0, this.width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(stackedData, layer => d3.max(layer, sequence => sequence[1])) || 200000])
      .range([this.height, 0]);

    this.svg.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));

    this.svg.append("g")
      .call(d3.axisLeft(y));

    this.svg.selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
      .style("fill", (d: any) => color(d.key))
      .attr("d", d3.area<any>()
        .x((d: any) => x(d.data.year))
        .y0((d: any) => y(d[0]))
        .y1((d: any) => y(d[1]))
      );

    // إضافة التسميات
    this.svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", this.width - 100)
      .attr("y", (d: string, i: number) => 10 + i * 30)
      .style("fill", (d: string) => color(d))
      .text((d: string) => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  }
}

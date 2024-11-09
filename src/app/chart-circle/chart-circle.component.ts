import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-circle',
  standalone: true,
  imports: [],
  templateUrl: './chart-circle.component.html',
  styleUrls: ['./chart-circle.component.scss'] 
})
export class ChartCircleComponent implements OnInit {
  data: number[] = [10, 20, 30, 40, 50];
  width: number = 500;
  height: number = 500;
  radius: number = Math.min(this.width, this.height) / 2;

  ngOnInit(): void {
    const svg = d3.select("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("transform", `translate(${this.width / 2},${this.height / 2})`);

    const pie = d3.pie<number>(); 

    const arc = d3.arc<d3.PieArcDatum<number>>()
        .innerRadius(0)
        .outerRadius(this.radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg.selectAll(".arc")
        .data(pie(this.data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc as any)
        .attr("fill", (d: d3.PieArcDatum<number>, i: number) => color(i.toString()));

    g.append("text") 
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .text((d) => String(d.data));
  }
}
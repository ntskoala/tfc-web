import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-completar-fechas',
  templateUrl: './completar-fechas.component.html',
  styleUrls: ['./completar-fechas.component.css']
})
export class CompletarFechasComponent implements OnInit, OnChanges {
  @Input() askCompletaFechas:boolean=false;
  @Output() onCompletarFechas:EventEmitter<boolean> = new EventEmitter<boolean>();
  public completaFechas:boolean=false;
  public askCompletarFechas:boolean;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.askCompletarFechas = this.askCompletaFechas;
  }

  cerrarCompletarFechas(){
    this.askCompletaFechas= false
    this.askCompletarFechas= false
    this.onCompletarFechas.emit(null);
  }
  okcompletarFechas(){
    console.log(this.completaFechas);
    this.askCompletaFechas = false;
    this.askCompletarFechas= false
    this.onCompletarFechas.emit(this.completaFechas);
   // this.terminar2(this.completaFechas);
  }


}

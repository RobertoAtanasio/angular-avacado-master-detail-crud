import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';

import currenctFormatter from 'currency-formatter';

import toastr from 'toastr';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  revenueTotal: any = 0;
  expenseTotal: any = 0;
  balance: any = 0;

  revenueChartData: any;
  expenseChartData: any;

  charOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(
    private categoryService: CategoryService,
    private entryService: EntryService
  ) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(
        data => this.categories = data,
        () => toastr.error('Não foi possível selecionar as categorias. Favor tentar mais tarde!')
      );
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;
    if ( !month || !year ) {
      alert('Informe o mês e o ano para geração do relatório');
    } else {
      this.entryService.getByMonthAndYear(month, year )
        .subscribe(
          this.setValues.bind(this),
          () => {
            // alert('Erro ao gerar o relatório.');
            toastr.error('Erro ao gerar o relatório.')
          }
        );
    }
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let revenueTotal = 0;
    let expenseTotal = 0;

    this.entries.forEach(entry => {
      if (entry.type === 'revenue') {
        revenueTotal += currenctFormatter.unformat(entry.amount, { code: 'BRL' }) ;
      } else {
        expenseTotal += currenctFormatter.unformat(entry.amount, { code: 'BRL' }) ;
      }
    });

    this.revenueTotal = currenctFormatter.format(revenueTotal, { code: 'BRL' });
    this.expenseTotal = currenctFormatter.format(expenseTotal, { code: 'BRL' });
    this.balance = currenctFormatter.format(revenueTotal - expenseTotal, { code: 'BRL' });
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9ccc65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }

  private getChartData(entryType: string, title: string, color: string) {
    const charData = [];

    this.categories.forEach(category => {
      // filtrando lançamentos pela categoria e tipo
      const filtroEntries = this.entries.filter(
        entry => {
          if ((entry.categoryId === category.id) && (entry.type === entryType)) {
            return entry;
          }
        }
      );
      // encontrou lançamento na categoria
      if (filtroEntries.length > 0) {

        const totalAmount = filtroEntries.reduce(
          (total, entry) => total + currenctFormatter.unformat(entry.amount, { code: 'BRL' }), 0
        );

        charData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        });
      }
    });
    return {
      labels: charData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: charData.map(item => item.totalAmount)
      }]
    }
  }
}

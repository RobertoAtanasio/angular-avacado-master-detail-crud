import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';

import { BaseResourceListComponent } from '../../../shared/components/base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent extends BaseResourceListComponent<Entry> {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) {
    super(entryService);
   }


  // deleteEntry(entry: Entry) {
  //   const mustDelete = confirm('Deseja realmente excluir este item?');
  //   if (mustDelete) {
  //     this.entryService.delete(entry.id).subscribe(
  //       () => this.entries = this.entries.filter(data => data !== entry ),
  //       () => alert('Erro ao tentar excluir as entradas')
  //     )
  //   }
  // }

}

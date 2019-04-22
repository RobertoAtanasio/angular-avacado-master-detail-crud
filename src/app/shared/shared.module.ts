import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';

@NgModule({
  declarations: [
    BreadCrumbComponent,
    PageHeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // shared modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // shared components: para que todos os módulos que importarem SharedModule tenham acesso ao BreadCrumbComponent
    BreadCrumbComponent,
    PageHeaderComponent
  ]
})
export class SharedModule { }

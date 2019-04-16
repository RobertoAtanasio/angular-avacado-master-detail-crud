import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Category } from './../shared/category.model';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categorias: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => {
        this.categorias = categories;
        // console.log('>> Lista', this.categorias);
      },
      error => alert('Erro ao carregar a lista.')
    );
  }

  deleteCategoria(category: Category) {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => this.categorias = this.categorias.filter(data => data !== category ),
        () => alert('Erro ao tentar excluir categoria')
      )
    }
  }
}

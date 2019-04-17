import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap, catchError } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  private setCurrentAction() {
    // console.log('>> ação:', this.route.snapshot.url[0].path);
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category);
        },
        (error) => {
          alert('Ocorreu um erro no servidor. Tente mais tarde');
        }
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category)
      .subscribe(
        data => this.actionsForSuccess(data),
        error => this.actionsForErro(error)
      );
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
      .subscribe(
        data => this.actionsForSuccess(data),
        error => this.actionsForErro(error)
      );
  }

  private actionsForSuccess(category: Category) {
    toastr.success('Solicitação processada com sucesso!');

    // Exemplificando como é o funcionamento abaixO do router:
    // nomedosite.com/categories/new        página atual
    // nomedosite.com/categories            carrega esta página
    // nomedosite.com/categories/:id/edit   chama a página de edição
    // obs.: o skipLocationChange faz com que não seja guardada o histórico da página
    //       no browser do navegador.

    // redirect/reload component page
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }

  private actionsForErro(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação.');
    this.submittingForm = false;
    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
      // exemplo: ['Nome já existe','O email não pode ficar em branco']
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }
}

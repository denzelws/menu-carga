import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ConcessoesService } from '../../core/concessoes.service';
import { DIREITO_ACESSO, MAX_MODULO, MAX_PESSOA, PATH_MODULOS_MENU } from '../../core/models';

type EstadoCadastro = 'inicial' | 'incompleto' | 'enviando' | 'criado' | 'duplicada' | 'erro';

function naoBranco(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (typeof valor !== 'string') {
    return null;
  }
  return valor.trim().length > 0 ? null : { branco: true };
}

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly concessoes = inject(ConcessoesService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly maxPessoa = MAX_PESSOA;
  protected readonly maxModulo = MAX_MODULO;
  protected readonly estado = signal<EstadoCadastro>('inicial');
  protected readonly erro = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    pessoa: ['', [Validators.required, naoBranco, Validators.maxLength(MAX_PESSOA)]],
    modulo: ['', [Validators.required, naoBranco, Validators.maxLength(MAX_MODULO)]],
    path: [
      { value: PATH_MODULOS_MENU, disabled: true },
      [Validators.required, Validators.pattern(`^${PATH_MODULOS_MENU}$`)],
    ],
    direito: [
      { value: DIREITO_ACESSO, disabled: true },
      [Validators.required, Validators.pattern(`^${DIREITO_ACESSO}$`)],
    ],
  });

  salvar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.estado.set('incompleto');
      return;
    }
    const bruto = this.form.getRawValue();
    this.estado.set('enviando');
    this.erro.set('');
    this.concessoes
      .criar({
        pessoa: bruto.pessoa.trim(),
        modulo: bruto.modulo.trim(),
        path: bruto.path.trim(),
        direito: bruto.direito.trim(),
      })
      .subscribe({
        next: () => this.estado.set('criado'),
        error: (e: Error) => {
          this.erro.set(e.message);
          this.estado.set(e.message === 'concessao duplicada' ? 'duplicada' : 'erro');
        },
      });
  }
}

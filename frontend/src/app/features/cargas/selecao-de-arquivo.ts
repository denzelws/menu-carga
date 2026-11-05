import { Injectable, signal } from '@angular/core';

/** Sobrevive à troca de rota. A tela de importação é destruída ao sair. */
@Injectable({ providedIn: 'root' })
export class SelecaoDeArquivo {
  private readonly selecionado = signal<File | null>(null);

  readonly arquivo = this.selecionado.asReadonly();

  definir(arquivo: File | null): void {
    this.selecionado.set(arquivo);
  }
}

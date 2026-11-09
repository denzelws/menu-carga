import { afterNextRender, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { AvisoAquecimento } from '../../core/aviso-aquecimento';
import { CargasService } from '../../core/cargas.service';
import { CABECALHO_CSV, ResultadoCarga } from '../../core/models';
import { SelecaoDeArquivo } from './selecao-de-arquivo';

type EstadoCarga = 'inicial' | 'enviando' | 'resultado' | 'rejeitado' | 'erro';

@Component({
  selector: 'app-importacao',
  imports: [AvisoAquecimento],
  templateUrl: './cargas.html',
})
export class Importacao {
  private readonly cargas = inject(CargasService);
  private readonly selecao = inject(SelecaoDeArquivo);
  private readonly campo = viewChild<ElementRef<HTMLInputElement>>('arquivoInput');

  protected readonly estado = signal<EstadoCarga>('inicial');
  protected readonly erro = signal('');
  protected readonly arquivo = this.selecao.arquivo;
  protected readonly resultado = signal<ResultadoCarga | null>(null);

  constructor() {
    afterNextRender(() => this.refletirNoInput());
  }

  baixarModelo(): void {
    const blob = new Blob([`${CABECALHO_CSV}\n`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modelo-concessoes.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  escolher(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.selecao.definir(input.files?.[0] ?? null);
  }

  remover(input: HTMLInputElement): void {
    this.selecao.definir(null);
    input.value = '';
  }

  private refletirNoInput(): void {
    const input = this.campo()?.nativeElement;
    const arquivo = this.arquivo();
    if (!input || !arquivo || typeof DataTransfer === 'undefined') {
      return;
    }
    const lista = new DataTransfer();
    lista.items.add(arquivo);
    input.files = lista.files;
  }

  enviar(evento: Event): void {
    evento.preventDefault();
    const arquivo = this.arquivo();
    if (!arquivo) {
      return;
    }
    this.estado.set('enviando');
    this.erro.set('');
    this.resultado.set(null);
    this.cargas.enviar(arquivo).subscribe({
      next: (resultado) => {
        this.resultado.set(resultado);
        this.estado.set('resultado');
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.estado.set(e.message === 'arquivo rejeitado' ? 'rejeitado' : 'erro');
      },
    });
  }
}

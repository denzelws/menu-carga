import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvisoAquecimento } from '../../core/aviso-aquecimento';
import { ConcessoesService } from '../../core/concessoes.service';
import { MAX_PESSOA } from '../../core/models';

type EstadoConsulta = 'inicial' | 'carregando' | 'permitido' | 'negado' | 'vazio' | 'erro';

@Component({
  selector: 'app-consulta',
  imports: [FormsModule, AvisoAquecimento],
  templateUrl: './consulta.html',
})
export class Consulta {
  private readonly concessoes = inject(ConcessoesService);

  protected readonly pessoa = signal('');
  protected readonly estado = signal<EstadoConsulta>('inicial');
  protected readonly erro = signal('');
  protected readonly maxPessoa = MAX_PESSOA;

  consultar(): void {
    this.estado.set('carregando');
    this.erro.set('');
    this.concessoes.consultar(this.pessoa()).subscribe({
      next: (resposta) => {
        if (resposta === null) {
          this.estado.set('vazio');
        } else {
          this.estado.set(resposta.permitido ? 'permitido' : 'negado');
        }
      },
      error: (e: Error) => {
        this.estado.set('erro');
        this.erro.set(e.message);
      },
    });
  }
}

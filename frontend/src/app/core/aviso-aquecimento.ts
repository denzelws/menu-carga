import { Component, effect, input, signal } from '@angular/core';

export const ATRASO_AVISO_AQUECIMENTO_MS = 3000;

@Component({
  selector: 'app-aviso-aquecimento',
  templateUrl: './aviso-aquecimento.html',
})
export class AvisoAquecimento {
  readonly ativo = input(false);
  protected readonly visivel = signal(false);

  constructor() {
    effect((onCleanup) => {
      this.visivel.set(false);
      if (!this.ativo()) {
        return;
      }
      const temporizador = setTimeout(() => this.visivel.set(true), ATRASO_AVISO_AQUECIMENTO_MS);
      onCleanup(() => clearTimeout(temporizador));
    });
  }
}

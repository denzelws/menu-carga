import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ATRASO_AVISO_AQUECIMENTO_MS, AvisoAquecimento } from './aviso-aquecimento';

@Component({
  imports: [AvisoAquecimento],
  template: '<app-aviso-aquecimento [ativo]="ativo()" />',
})
class Host {
  readonly ativo = signal(false);
}

describe('AvisoAquecimento', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function criar() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('mostra o aviso só depois da espera', async () => {
    const fixture = criar();
    fixture.componentInstance.ativo.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('estão acordando');

    await vi.advanceTimersByTimeAsync(ATRASO_AVISO_AQUECIMENTO_MS);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('estão acordando');
  });

  it('esconde o aviso quando a espera termina antes do prazo', async () => {
    const fixture = criar();
    fixture.componentInstance.ativo.set(true);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(ATRASO_AVISO_AQUECIMENTO_MS - 1);
    fixture.componentInstance.ativo.set(false);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('estão acordando');
  });
});

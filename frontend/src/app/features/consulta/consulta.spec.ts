import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Consulta } from './consulta';
import { API_PREFIX } from '../../core/api-config';
import { MAX_PESSOA } from '../../core/models';

describe('Consulta', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consulta],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  function consultar(pessoa: string, resposta: { status: number; body: object | null }) {
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Consulta);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#pessoa') as HTMLInputElement;
    input.value = pessoa;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.componentInstance.consultar();
    const requisicao = http.expectOne((req) => req.url === `${API_PREFIX}/modulos/menu`);
    requisicao.flush(resposta.body, { status: resposta.status, statusText: 'OK' });
    fixture.detectChanges();
    return { fixture, requisicao };
  }

  it('mostra permitido quando a API devolve true', () => {
    const { fixture, requisicao } = consultar('Ana', {
      status: 200,
      body: { permitido: true },
    });
    expect(requisicao.request.params.get('pessoa')).toBe('Ana');
    expect(fixture.nativeElement.textContent).toContain('permitido: true');
  });

  it('mostra negado quando a API devolve false', () => {
    const { fixture } = consultar('Bruno', { status: 200, body: { permitido: false } });
    expect(fixture.nativeElement.textContent).toContain('permitido: false');
  });

  it('limita o nome ao tamanho da coluna pessoa', () => {
    const fixture = TestBed.createComponent(Consulta);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#pessoa') as HTMLInputElement;
    expect(input.maxLength).toBe(MAX_PESSOA);
  });

  it('mostra estado vazio quando a API devolve 200 sem corpo', () => {
    const { fixture, requisicao } = consultar('   ', { status: 200, body: null });
    expect(requisicao.request.params.has('pessoa')).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('corpo vazio');
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Cadastro } from './cadastro';
import { httpErrorInterceptor } from '../../core/http-error.interceptor';
import { API_PREFIX } from '../../core/api-config';
import { DIREITO_ACESSO, PATH_MODULOS_MENU } from '../../core/models';

describe('Cadastro', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cadastro],
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  function preencher(pessoa: string, modulo: string) {
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Cadastro);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    const campoPessoa = raiz.querySelector('#pessoa') as HTMLInputElement;
    const campoModulo = raiz.querySelector('#modulo') as HTMLInputElement;
    campoPessoa.value = pessoa;
    campoPessoa.dispatchEvent(new Event('input'));
    campoModulo.value = modulo;
    campoModulo.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return { http, fixture, raiz };
  }

  it('envia os quatro campos com trim, inclusive path e direito travados', () => {
    const { http, fixture, raiz } = preencher('  Ana  ', '  gestao-estoque  ');
    (raiz.querySelector('button') as HTMLButtonElement).click();
    const requisicao = http.expectOne(`${API_PREFIX}/concessoes`);
    expect(requisicao.request.body).toEqual({
      pessoa: 'Ana',
      modulo: 'gestao-estoque',
      path: PATH_MODULOS_MENU,
      direito: DIREITO_ACESSO,
    });
    requisicao.flush('', { status: 201, statusText: 'Created' });
    fixture.detectChanges();
    expect(raiz.textContent).toContain('HTTP 201');
  });

  it('mostra concessao duplicada quando a API responde 409', () => {
    const { http, fixture, raiz } = preencher('Ana', 'gestao-estoque');
    (raiz.querySelector('button') as HTMLButtonElement).click();
    http
      .expectOne(`${API_PREFIX}/concessoes`)
      .flush(JSON.stringify({ error: 'concessao duplicada' }), {
        status: 409,
        statusText: 'Conflict',
      });
    fixture.detectChanges();
    expect(raiz.textContent).toContain('Concessão duplicada');
    expect(raiz.textContent).toContain('HTTP 409');
  });

  it('não envia quando pessoa é só espaço', () => {
    const { http, fixture, raiz } = preencher('   ', 'gestao-estoque');
    (raiz.querySelector('button') as HTMLButtonElement).click();
    http.expectNone(`${API_PREFIX}/concessoes`);
    fixture.detectChanges();
    expect(raiz.textContent).toContain('Campos incompletos');
  });
});

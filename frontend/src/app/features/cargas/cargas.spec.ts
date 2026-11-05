import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { Importacao } from './cargas';
import { SelecaoDeArquivo } from './selecao-de-arquivo';
import { CABECALHO_CSV } from '../../core/models';
import { httpErrorInterceptor } from '../../core/http-error.interceptor';
import { API_PREFIX } from '../../core/api-config';

describe('Importacao', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Importacao],
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    TestBed.inject(SelecaoDeArquivo).definir(null);
  });

  function tela() {
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Importacao);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    return { http, fixture, raiz };
  }

  function importar(raiz: HTMLElement) {
    (raiz.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
  }

  function escolher(raiz: HTMLElement, conteudo: string, nome: string) {
    const input = raiz.querySelector('#arquivo') as HTMLInputElement;
    const arquivo = new File([conteudo], nome, { type: 'text/csv' });
    Object.defineProperty(input, 'files', { configurable: true, value: [arquivo] });
    input.dispatchEvent(new Event('change'));
  }

  it('baixa um CSV só com o cabeçalho', async () => {
    const { raiz } = tela();
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:modelo');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const cliques: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      cliques.push(this.download);
    });
    (raiz.querySelector('#modelo') as HTMLButtonElement).click();
    const blob = create.mock.calls[0][0] as Blob;
    expect(await blob.text()).toBe(`${CABECALHO_CSV}\n`);
    expect(cliques).toEqual(['modelo-concessoes.csv']);
    vi.restoreAllMocks();
  });

  it('deixa Importar desabilitado até haver um arquivo', () => {
    const { http, fixture, raiz } = tela();
    const botao = raiz.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(botao.disabled).toBe(true);
    importar(raiz);
    http.expectNone(`${API_PREFIX}/cargas`);
    escolher(raiz, 'pessoa,modulo,path,direito\n', 'lote.csv');
    fixture.detectChanges();
    expect(botao.disabled).toBe(false);
  });

  it('mantém o arquivo ao recriar a tela e remove ao clicar', () => {
    const { fixture, raiz } = tela();
    escolher(raiz, 'pessoa,modulo,path,direito\n', 'lote.csv');
    fixture.detectChanges();
    expect(raiz.textContent).toContain('lote.csv');
    fixture.destroy();

    const deNovo = TestBed.createComponent(Importacao);
    deNovo.detectChanges();
    const raizNova = deNovo.nativeElement as HTMLElement;
    const botao = raizNova.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(raizNova.textContent).toContain('lote.csv');
    expect(botao.disabled).toBe(false);

    (raizNova.querySelector('#remover') as HTMLButtonElement).click();
    deNovo.detectChanges();
    expect(raizNova.textContent).not.toContain('lote.csv');
    expect(botao.disabled).toBe(true);
  });

  it('envia a parte arquivo e mostra persisted com o erro da linha', () => {
    const { http, fixture, raiz } = tela();
    escolher(raiz, 'pessoa,modulo,path,direito\n', 'lote.csv');
    importar(raiz);
    const requisicao = http.expectOne(`${API_PREFIX}/cargas`);
    const corpo = requisicao.request.body as FormData;
    expect(corpo.get('arquivo')).toBeInstanceOf(File);
    expect((corpo.get('arquivo') as File).name).toBe('lote.csv');
    requisicao.flush({
      persisted: 1,
      errors: [{ line: 3, message: 'campo obrigatorio' }],
    });
    fixture.detectChanges();
    expect(raiz.textContent).toContain('HTTP 200');
    expect(raiz.textContent).toContain('1 concessão gravada');
    expect(raiz.textContent).toContain('3');
    expect(raiz.textContent).toContain('campo obrigatorio');
  });

  it('mostra arquivo rejeitado quando a API responde 400', () => {
    const { http, fixture, raiz } = tela();
    escolher(raiz, 'cabeçalho errado\n', 'ruim.csv');
    importar(raiz);
    http
      .expectOne(`${API_PREFIX}/cargas`)
      .flush({ error: 'arquivo rejeitado' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    expect(raiz.textContent).toContain('Arquivo rejeitado');
    expect(raiz.textContent).toContain('HTTP 400');
  });
});

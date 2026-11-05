import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErroArquivo } from './models';

export function mensagemDeErro(status: number, corpo: unknown): string {
  if (status === 0) {
    return 'API fora do ar. Verifique se o backend está em execução.';
  }
  const erro = (corpo as ErroArquivo | null)?.error;
  if ((status === 400 || status === 409) && erro) {
    return erro;
  }
  if (status === 400) {
    return 'Requisição inválida. Confira os campos.';
  }
  return 'Erro inesperado. Tente de novo.';
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((erro: HttpErrorResponse) =>
      throwError(() => new Error(mensagemDeErro(erro.status, erro.error))),
    ),
  );

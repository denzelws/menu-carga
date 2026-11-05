import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_PREFIX } from './api-config';
import { NovaConcessao, PermissaoResponse } from './models';

@Injectable({ providedIn: 'root' })
export class ConcessoesService {
  private readonly http = inject(HttpClient);

  consultar(pessoa: string): Observable<PermissaoResponse | null> {
    const nome = pessoa.trim();
    const params = nome ? new HttpParams().set('pessoa', nome) : undefined;
    return this.http
      .get<PermissaoResponse>(`${API_PREFIX}/modulos/menu`, {
        params,
        observe: 'response',
      })
      .pipe(map((resposta: HttpResponse<PermissaoResponse>) => resposta.body));
  }

  criar(concessao: NovaConcessao): Observable<void> {
    return this.http
      .post(`${API_PREFIX}/concessoes`, concessao, { responseType: 'text' })
      .pipe(map(() => undefined));
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_PREFIX } from './api-config';
import { NovaConcessao, PermissaoResponse } from './models';

@Injectable({ providedIn: 'root' })
export class ConcessoesService {
  private readonly http = inject(HttpClient);

  consultar(pessoa: string): Observable<PermissaoResponse | null> {
    const params = new HttpParams().set('pessoa', pessoa);
    return this.http.get<PermissaoResponse | null>(`${API_PREFIX}/modulos/menu`, { params });
  }

  criar(concessao: NovaConcessao): Observable<void> {
    return this.http.post<void>(`${API_PREFIX}/concessoes`, concessao);
  }
}

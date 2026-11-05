import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_PREFIX } from './api-config';
import { ResultadoCarga } from './models';

@Injectable({ providedIn: 'root' })
export class CargasService {
  private readonly http = inject(HttpClient);

  enviar(arquivo: File): Observable<ResultadoCarga> {
    const form = new FormData();
    form.append('arquivo', arquivo);
    return this.http.post<ResultadoCarga>(`${API_PREFIX}/cargas`, form);
  }
}

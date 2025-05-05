import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialClinicoService {
  private apiUrl = 'http://localhost:8090/api/historiales';

  constructor(private http: HttpClient) {}

  listaHistoriales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  generarHistorial(historial: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, historial);
  }

  obtenerHistorialPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  editarHistorial(id: number, historial: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, historial);
  }

  eliminarHistorial(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

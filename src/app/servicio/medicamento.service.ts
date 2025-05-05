import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private apiUrl = 'http://localhost:8090/api/medicamentos'; // Ajusta la URL de tu backend

  constructor(private http: HttpClient) {}

  listarMedicamentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  obtenerMedicamentoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  agregarMedicamento(medicamento: any): Observable<any> {
    return this.http.post(this.apiUrl, medicamento);
  }

  actualizarMedicamento(id: number, medicamento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, medicamento);
  }

  eliminarMedicamento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
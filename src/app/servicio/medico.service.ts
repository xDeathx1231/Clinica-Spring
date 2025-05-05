import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apiUrl = 'http://localhost:8090/api/medicos'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) { }

  // Obtener lista de médicos
  listaMedicos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear un nuevo médico
  generarMedico(request: any): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, request);
  }

  // Eliminar un médico por ID
  eliminarMedico(id: number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }

  // Obtener un médico por ID
  obtenerMedicoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  

  // Editar un médico por ID
  editarMedico(id: number, request: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, request);
  }
}

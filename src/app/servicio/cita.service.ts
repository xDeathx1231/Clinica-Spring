import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8090/api/citas';  // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  // Método para obtener todas las citas
  listaCitas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);  // Realiza la solicitud GET
  }

  // Método para crear una nueva cita
  crearCita(citaData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, citaData);
  }

  // Método para editar una cita
  editarCita(id: number, cita: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cita);
  }

  // Método para eliminar una cita
  eliminarCita(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

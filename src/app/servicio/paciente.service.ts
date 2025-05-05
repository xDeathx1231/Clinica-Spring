import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:8090/api/pacientes'; // Ajusta la URL de tu backend

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getPacienteById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createPaciente(paciente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, paciente); // Endpoint de tu API para crear pacientes
  }
  

  updatePaciente(id: number, paciente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente);
  }

  deletePaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

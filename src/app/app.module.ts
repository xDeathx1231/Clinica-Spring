import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';  // Este es el archivo donde defines tus rutas
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';  // El componente home
import { MedicosComponent } from './components/medico/medico.component';
import { CitaComponent } from './components/cita/cita.component';
import { HistorialClinicoComponent } from './components/historial-clinico/historial-clinico.component';
import { MedicamentoComponent } from './components/medicamento/medicamento.component';
import { PacientesComponent } from './components/paciente/paciente.component';
import { NavbarComponent } from './navbar/navbar.component';  // El componente navbar
import { CrearPacienteComponent } from './components/crear-paciente/crear-paciente.component';
import { EditarPacienteComponent } from './components/editar-paciente/editar-paciente.component';

// Importar otros módulos necesarios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MedicosComponent,
    CitaComponent,
    HistorialClinicoComponent,
    MedicamentoComponent,
    PacientesComponent,
    CrearPacienteComponent,
    EditarPacienteComponent,
    NavbarComponent  // Declarar tu componente navbar aquí
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  // Importar el AppRoutingModule que contiene las rutas
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MedicosComponent } from './components/medico/medico.component';
import { CitaComponent } from './components/cita/cita.component';
import { HistorialClinicoComponent } from './components/historial-clinico/historial-clinico.component';
import { MedicamentoComponent } from './components/medicamento/medicamento.component';
import { PacientesComponent } from './components/paciente/paciente.component';
import { CrearPacienteComponent } from './components/crear-paciente/crear-paciente.component';
import { EditarPacienteComponent } from './components/editar-paciente/editar-paciente.component';

const routes: Routes = [
  { path: '', component: HomeComponent },  // Ruta predeterminada, muestra el home
  { path: 'home', component: HomeComponent },
  { path: 'paciente', component: PacientesComponent },
  { path: 'pacientes/crear', component : CrearPacienteComponent},
  { path: 'pacientes/editar/:id', component :EditarPacienteComponent},
  { path: 'medico', component: MedicosComponent },
  { path: 'cita', component: CitaComponent },
  { path: 'historial-clinico', component: HistorialClinicoComponent },
  { path: 'medicamento', component: MedicamentoComponent },
  { path: '**', redirectTo: '' }  // Redirige al home si no se encuentra la ruta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configuración de las rutas
  exports: [RouterModule]
})
export class AppRoutingModule { }

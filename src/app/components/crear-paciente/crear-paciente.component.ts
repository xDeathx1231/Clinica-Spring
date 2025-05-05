import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../../servicio/paciente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent {
  paciente: any = {
    nombre: '',
    edad: null,
    direccion: '',
    telefono: '',
    correo: ''
  };

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  crearPaciente(): void {
    
    if (
      !this.paciente.nombre ||
      !this.paciente.edad ||
      !this.paciente.direccion ||
      !this.paciente.telefono ||
      !this.paciente.correo
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
      return;
    }


    
    if (this.paciente.edad <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'La edad debe ser un número positivo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(this.paciente.correo)) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor ingresa un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
      return;
    }

    
    this.pacienteService.createPaciente(this.paciente).subscribe(
      () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Paciente creado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/pacientes']); 
        });
      },
      (error) => {
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un problema al crear el paciente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33'
        });
        console.error('Error al crear el paciente:', error);
      }
    );
  }

  cancelar(): void {
    this.router.navigate(['/pacientes']); 
  }
}

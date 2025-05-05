import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../servicio/paciente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css']
})
export class EditarPacienteComponent implements OnInit {
  paciente: any = {};
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.obtenerPaciente();
  }

  obtenerPaciente(): void {
    this.pacienteService.getPacienteById(this.id).subscribe(
      (data) => {
        this.paciente = data.paciente;
      },
      (error) => {
        console.error('Error al obtener los datos del paciente:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información del paciente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  guardarCambios(): void {
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

    this.pacienteService.updatePaciente(this.id, this.paciente).subscribe(
      () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Paciente actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/paciente']);
        });
      },
      (error) => {
        console.error('Error al actualizar el paciente:', error);
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un problema al actualizar el paciente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  cancelar(): void {
    this.router.navigate(['/paciente']);
  }
}

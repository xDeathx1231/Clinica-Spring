import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HistorialClinicoService } from '../../servicio/historial-clinico.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-historial-clinico',
  templateUrl: './historial-clinico.component.html',
  styleUrls: ['./historial-clinico.component.css']
})
export class HistorialClinicoComponent implements OnInit {
  listaHistoriales: any[] = [];
  formHistorial: FormGroup;
  title: string = '';
  nameBoton: string = '';
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private historialService: HistorialClinicoService
  ) {
    // Formulario reactivo
    this.formHistorial = this.fb.group({
      paciente: ['', [Validators.required]],
      diagnostico: ['', [Validators.required]],
      tratamiento: ['', [Validators.required]],
      fecha: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.obtenerHistoriales();
  }

  // Obtener lista de historiales
  obtenerHistoriales(): void {
    this.historialService.listaHistoriales().subscribe(
      (data: any) => {
        this.listaHistoriales = data.historiales;
      },
      (error) => console.error('Error al obtener los historiales:', error)
    );
  }

  // Crear o editar historial clínico
  crearHistorial(nameBtn: string): void {
    if (this.formHistorial.valid) {
      const historialData = this.formHistorial.value;

      if (nameBtn === 'Guardar') {
        this.historialService.generarHistorial(historialData).subscribe(
          () => {
            this.obtenerHistoriales();
            this.cerrarBoton();
            Swal.fire('Historial creado', 'El historial ha sido creado exitosamente.', 'success');
          },
          (error) => console.error('Error al crear el historial:', error)
        );
      } else if (nameBtn === 'Modificar' && this.id) {
        this.historialService.editarHistorial(this.id, historialData).subscribe(
          () => {
            this.obtenerHistoriales();
            this.cerrarBoton();
            Swal.fire('Historial modificado', 'El historial ha sido modificado exitosamente.', 'success');
          },
          (error) => console.error('Error al modificar el historial:', error)
        );
      }
    } else {
      Swal.fire('Error', 'Por favor, completa todos los campos obligatorios.', 'error');
      this.formHistorial.markAllAsTouched();
    }
  }

  titulo(accion: string, id: number | null): void {
    this.title = `${accion} Historial`;
    this.nameBoton = accion === 'Crear' ? 'Guardar' : 'Modificar';

    if (accion === 'Crear') {
      this.formHistorial.reset();
      this.id = null;
    } else if (id !== null) {
      this.id = id;
      this.obtenerHistorialPorId(id);
    }
  }

  // Obtener historial por ID
  obtenerHistorialPorId(id: number): void {
    this.historialService.obtenerHistorialPorId(id).subscribe(
      (data: any) => {
        if (data && data.historial) {
          this.formHistorial.patchValue({
            paciente: data.historial.paciente,
            diagnostico: data.historial.diagnostico,
            tratamiento: data.historial.tratamiento,
            fecha: data.historial.fecha
          });
        }
      },
      (error) => {
        console.error('Error al obtener el historial:', error);
        Swal.fire('Error', 'No se pudieron cargar los datos del historial.', 'error');
      }
    );
  }

  // Eliminar historial clínico
  eliminarHistorial(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.historialService.eliminarHistorial(id).subscribe(
          () => {
            this.listaHistoriales = this.listaHistoriales.filter(historial => historial.id !== id);
            Swal.fire('Eliminado', 'El historial ha sido eliminado.', 'success');
          },
          (error) => console.error('Error al eliminar el historial:', error)
        );
      }
    });
  }

  // Cerrar el modal
  cerrarBoton(): void {
    const modalElement = document.getElementById('modalHistorial');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}

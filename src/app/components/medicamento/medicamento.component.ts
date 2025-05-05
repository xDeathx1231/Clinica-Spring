import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicamentoService } from '../../servicio/medicamento.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.css']
})
export class MedicamentoComponent implements OnInit {
  listaMedicamentos: any[] = [];
  formMedicamento: FormGroup;
  titulo: string = '';
  botonAccion: string = '';
  idSeleccionado!: number;

  constructor(private medicamentoService: MedicamentoService,private cdr: ChangeDetectorRef) {
    this.formMedicamento = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      descripcion: new FormControl(null),
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
      precio: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    });
  }


  ngOnInit(): void {
    console.log("Iniciando el componente y obteniendo medicamentos...");
    this.obtenerMedicamentos();
  }

  obtenerMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe(
      (response) => {
        // Asegúrate de que estás accediendo a la propiedad correcta de la respuesta
        if (response && response.medicamentos) {
          this.listaMedicamentos = response.medicamentos;
          console.log('Lista de medicamentos:', this.listaMedicamentos);
        } else {
          console.error('Respuesta sin los datos esperados', response);
        }
      },
      (error) => console.error('Error al obtener medicamentos:', error)
    );
  }
  
  

  abrirModal(titulo: string, medicamento?: any) {
    this.titulo = `${titulo} Medicamento`;
    this.botonAccion = titulo === 'Crear' ? 'Guardar' : 'Actualizar';
  
    if (titulo === 'Actualizar' && medicamento) {
      this.idSeleccionado = medicamento.id;
      this.formMedicamento.patchValue(medicamento); // Rellenar el formulario
    } else {
      this.formMedicamento.reset();
    }
  
    // Crear y mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalMedicamento'));
    modal.show();
  }
  
  

  guardarMedicamento() {
    if (this.formMedicamento.valid) {
      const medicamento = this.formMedicamento.value;
      const action = this.botonAccion === 'Guardar' 
        ? this.medicamentoService.agregarMedicamento(medicamento) 
        : this.medicamentoService.actualizarMedicamento(this.idSeleccionado, medicamento);
  
      action.subscribe(() => {
        this.mostrarAlerta(
          this.botonAccion === 'Guardar' 
          ? 'Medicamento registrado con éxito' 
          : 'Medicamento actualizado con éxito', 'success');
        
        // Obtener la lista de medicamentos después de la operación
        this.obtenerMedicamentos();
  
        // Usar un pequeño retraso antes de cerrar el modal
        setTimeout(() => {
          this.cerrarModal(); // Asegura que el modal se cierre correctamente
        }, 300);  // Ajusta el tiempo si es necesario
      });
    }
  }
  
  

  eliminarMedicamento(id: number) {
    Swal.fire({
      title: '¿Está seguro de eliminar este medicamento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicamentoService.eliminarMedicamento(id).subscribe(() => {
          this.mostrarAlerta('Medicamento eliminado', 'success');
          this.obtenerMedicamentos();
        });
      }
    });
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalMedicamento');
    const modalInstance = bootstrap.Modal.getInstance(modalElement); // Aquí usamos getInstance correctamente.
    if (modalInstance) {
      modalInstance.hide(); // Cerrar el modal
    }
  }
  
  
  

  mostrarAlerta(mensaje: string, tipo: any) {
    Swal.fire({
      position: 'top-end',
      icon: tipo,
      title: mensaje,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

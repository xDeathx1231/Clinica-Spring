import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CitaService } from '../../servicio/cita.service';
import { PacienteService } from '../../servicio/paciente.service';
import { MedicoService } from '../../servicio/medico.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css']
})
export class CitaComponent implements OnInit {

  listaCitas: any[] = [];
  listaPacientes: any[] = []; // Asegúrate de tener esta propiedad
  listaMedicos: any[] = [];   // Asegúrate de tener esta propiedad
  formCita: FormGroup;
  titulo: string = '';
  botonAccion: string = '';
  idSeleccionado!: number;
  datosCargados: boolean = false; 

  constructor(
    private citaService: CitaService,
    private PacienteService: PacienteService,
    private medicoService: MedicoService
  ) {
    this.formCita = new FormGroup({
      paciente: new FormControl(null, Validators.required),
      medico: new FormControl(null, Validators.required),
      fechaHora: new FormControl(null, Validators.required), // Asegúrate de que esté en el FormGroup
      motivo: new FormControl(null, Validators.required),
      estado: new FormControl('PENDIENTE', Validators.required),
    });
    
  }

  ngOnInit(): void {
    console.log("Iniciando el componente y obteniendo citas...");
    this.obtenerCitas();
    this.cargarPacientes();  // Cargar pacientes
    this.cargarMedicos();    // Cargar médicos
  }
  obtenerCitas() {
    this.citaService.listaCitas().subscribe(
      (response: any) => {
        this.listaCitas = response.citas || []; // Asigna las citas desde el back-end
        this.datosCargados = true; // Activa el efecto de desvanecimiento
      },
      (error) => {
        console.error('Error al cargar citas:', error);
        this.datosCargados = true; // Asegúrate de que la tabla se muestre incluso si hay un error
      }
    );
  }

  cargarPacientes() {
    this.PacienteService.getPacientes().subscribe(
      (data: any) => {
        this.listaPacientes = data.pacientes;
        console.log('Pacientes cargados:', this.listaPacientes);
      },
      (error) => console.error('Error al obtener pacientes:', error)
    );
  }

  cargarMedicos() {
    this.medicoService.listaMedicos().subscribe(
      (data: any) => {
        this.listaMedicos = data.medicos;
        console.log('Médicos cargados:', this.listaMedicos);
      },
      (error) => console.error('Error al obtener médicos:', error)
    );
  }

  abrirModal(titulo: string, cita?: any) {
    this.titulo = `${titulo} Cita`;
    this.botonAccion = titulo === 'Crear' ? 'Guardar' : 'Actualizar';
  
    if (titulo === 'Actualizar' && cita) {
      this.idSeleccionado = cita.id;
  
      // Convertir fecha y hora al formato esperado por datetime-local
      const fechaHora = new Date(cita.fechaHora).toISOString().slice(0, 16);
  
      this.formCita.patchValue({
        paciente: cita.paciente.id,
        medico: cita.medico.id,
        fechaHora: fechaHora,
        motivo: cita.motivo,
        estado: cita.estado,
      });
    } else {
      this.formCita.reset();
    }
  
    const modalElement = document.getElementById('modalCita');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  

  guardarCita() {
    if (this.formCita.valid) {
      const cita = this.formCita.value;
  
      // Enviar directamente el valor de fechaHora, ya que estará en el formato correcto
      const action = this.botonAccion === 'Guardar'
        ? this.citaService.crearCita({
            paciente: { id: cita.paciente },
            medico: { id: cita.medico },
            fechaHora: cita.fechaHora,
            motivo: cita.motivo,
            estado: cita.estado
          })
        : this.citaService.editarCita(this.idSeleccionado, {
            paciente: { id: cita.paciente },
            medico: { id: cita.medico },
            fechaHora: cita.fechaHora,
            motivo: cita.motivo,
            estado: cita.estado
          });
  
      action.subscribe(
        () => {
          this.mostrarAlerta(
            this.botonAccion === 'Guardar' 
              ? 'Cita registrada con éxito' 
              : 'Cita actualizada con éxito', 
            'success'
          );
  
          this.obtenerCitas();
          this.cerrarModal();
        },
        (error) => {
          console.error('Error al guardar o editar cita:', error);
          Swal.fire('Error', 'Hubo un problema al guardar o editar la cita.', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      this.formCita.markAllAsTouched();
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

  eliminarCita(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.eliminarCita(id).subscribe(() => {
          Swal.fire('Eliminado', 'La cita ha sido eliminada', 'success');
          this.obtenerCitas();
        });
      }
    });
  }

cerrarModal() {
  const modalElement = document.getElementById('modalCita');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement); // Obtén la instancia del modal
    if (modal) {
      modal.hide(); // Oculta el modal
    }
  }
}

}

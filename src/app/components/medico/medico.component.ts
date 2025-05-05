import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MedicoService } from '../../servicio/medico.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicosComponent implements OnInit {
  listaMedico: any[] = [];
  formMedico: FormGroup;
  title: any;
  nameBoton: any;
  id!: number;
  especialidades: string[] = ['Cardiología', 'Pediatría', 'Dermatología', 'Neurología', 'Gastroenterología'];

  constructor(private _medicoService: MedicoService) {
    this.formMedico = new FormGroup({
      nombre: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') // Solo letras y espacios
      ]),
      especialidad: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]{3}-[0-9]{4}$') // Formato xxx-xxxx
      ]),
      correo: new FormControl(null, [
        Validators.required,
        Validators.email // Valida formato de correo electrónico
      ]),
      horario: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]{1,2}:[0-9]{2} (AM|PM) - [0-9]{1,2}:[0-9]{2} (AM|PM)$') // Formato x:xx AM - x:xx PM
      ])
    });
  }

  ngOnInit(): void {
    this.obtenerMedicos();
    this.initForm();
  }

  initForm() {
    this.formMedico = new FormGroup({
      nombre: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
      ]),
      especialidad: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]{3}-[0-9]{4}$')
      ]),
      correo: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      horario: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]{1,2}:[0-9]{2} (AM|PM) - [0-9]{1,2}:[0-9]{2} (AM|PM)$')
      ])
    });
  }

  obtenerMedicos() {
    this._medicoService.listaMedicos().subscribe((data: any) => {
      this.listaMedico = data.medicos;
      console.log(this.listaMedico);
    }, (error) =>
      console.error('Error al consultar la Api', error));
  }

  registrarMedico(formulario: any): void {
    if (this.formMedico.valid) {
      this._medicoService.generarMedico(formulario).subscribe(
        response => {
          this.cerrarModal();
          this.obtenerMedicos();
          this.resetForm();
          console.log('Producto registrado ', response);
        }, error => {
          console.error('Error al Registrar un Medico', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al Registrar el Médico',
            timer: 5000
          });
        }
      );
    }
  }

  crearMedico(nameBtn: any) {
    if (nameBtn == "Guardar") {
      this.alertaRegistro();
    } else {
      this.alertaModificar();
    }
  }

  eliminarMedicos(id: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar el médico?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._medicoService.eliminarMedico(id)
          .subscribe((data) => {
            console.log("Médico eliminado ", data);
            this.listaMedico = this.listaMedico.filter(item => item.id !== id);
          }, error => {
            console.error('Error en la eliminación del médico', error);
          });

        this.alertaExitosa("eliminado");
      }
    });
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalMedico');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  resetForm() {
    this.formMedico.reset();
  }

  titulo(titulo: any, id: any) {
    this.title = `${titulo} médico`;
    titulo == "Crear" ? this.nameBoton = "Guardar" : this.nameBoton = "Modificar";
    if (id != null) {
      this.id = id;
      this.obtenerMedicoPorId(id);
    }
  }

  obtenerMedicoPorId(id: any) {
    let form = this.formMedico;
    this._medicoService.obtenerMedicoPorId(id)
      .subscribe((data: any) => {
        form.controls['nombre'].setValue(data.medicos.nombre);
        form.controls['especialidad'].setValue(data.medicos.especialidad);
        form.controls['telefono'].setValue(data.medicos.telefono);
        form.controls['correo'].setValue(data.medicos.correo);
        form.controls['horario'].setValue(data.medicos.horario);
      });
  }

  editarMedico(id: number, formulario: any): void {
    if (this.formMedico.valid) {
      this._medicoService.editarMedico(id, formulario).subscribe(
        response => {
          this.cerrarModal();
          this.obtenerMedicos();
          this.resetForm();
          console.log('Médico modificado ', response);
        },
        error => {
          console.error('Error al modificar el Médico', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al modificar el Médico',
            timer: 6000,
            showConfirmButton: true
          });
        }
      );
    }
  }

  alertaExitosa(titulo: any) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Médico " + titulo,
      showConfirmButton: false,
      timer: 1500
    });
  }

  cerrarBoton() {
    this.resetForm();
    this.cerrarModal();
  }

  alertaModificar() {
    Swal.fire({
      title: '¿Estás seguro de modificar el Médico?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, modificar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.editarMedico(this.id, this.formMedico.value);
        this.alertaExitosa("modificado");
      }
    });
  }

  alertaRegistro() {
    Swal.fire({
      title: '¿Estás seguro de registrar el Médico?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.registrarMedico(this.formMedico.value);
        this.alertaExitosa("registrado");
      }
    });
  }
}
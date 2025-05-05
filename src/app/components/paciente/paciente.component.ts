import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../servicio/paciente.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacientesComponent implements OnInit {
  listaPacientes: any[] = [];
  listaCompleta: any[] = [];  
  busqueda: string = ''; 
  imagenes: string[] = [
    'https://img.freepik.com/premium-vector/business-contract_442409-1502.jpg?w=740', 
  ];

  constructor(
    private _pacienteService: PacienteService,
    private router: Router
  ) {}

ngOnInit(): void {
    this.obtenerPacientes();
  }
  obtenerPacientes(): void {
    this._pacienteService.getPacientes().subscribe(
      (data: any) => {
        this.listaCompleta = data.pacientes.map((paciente: any, index: number) => ({
          ...paciente,
          imagen: this.imagenes[index] || 'https://img.freepik.com/premium-vector/business-contract_442409-1502.jpg?w=740'
        }));
        this.listaPacientes = [...this.listaCompleta]; 
        console.log('Pacientes con imágenes:', this.listaPacientes);
      },
      (error) => console.error('Error al consumir la API:', error)
    );
  }

  buscarPaciente(): void {
    const busquedaLower = this.busqueda.toLowerCase();

    
    if (this.busqueda.trim() === '') {
      this.listaPacientes = [...this.listaCompleta];
      return;
    }

    
    if (/[^a-zA-Z\s]/.test(this.busqueda)) {
      Swal.fire({
        title: 'Búsqueda inválida',
        text: 'Por favor, ingresa un nombre válido sin números ni caracteres especiales.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const resultado = this.listaCompleta.filter(
      (paciente) => paciente.nombre.toLowerCase().includes(busquedaLower)
    );

    if (resultado.length > 0) {
      this.listaPacientes = resultado;
      Swal.fire({
        title: 'Paciente encontrado',
        text: 'Se encontraron pacientes que coinciden con la búsqueda.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } else {
      Swal.fire({
        title: 'No se encontraron pacientes',
        text: 'No se encontraron pacientes que coincidan con la búsqueda.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.listaPacientes = [];  
    }
  }
  
  crearPaciente(): void {
    this.router.navigate(['/pacientes/crear']);
  }

  editarPaciente(id: number): void {
    this.router.navigate(['/pacientes/editar', id]);
  }


  eliminarPaciente(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar el paciente?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      timer: 5000,  
      timerProgressBar: true,  
      didOpen: () => {
        Swal.showLoading();  
      }
    }).then((result) => {
      if (result.isConfirmed) {
       
        this._pacienteService.deletePaciente(id).subscribe(
          () => {
            
            this.listaPacientes = this.listaPacientes.filter(p => p.id !== id);
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El paciente ha sido eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#3085d6'
            });
          },
          (error) => {
            console.error('Error al eliminar el paciente:', error);
            Swal.fire({
              title: '¡Error!',
              text: 'Hubo un problema al eliminar el paciente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#d33'
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
        console.log('Eliminación cancelada ');
      } 
      
      else if (result.dismiss === Swal.DismissReason.timer) {
      
        this._pacienteService.deletePaciente(id).subscribe(
          () => {
           
            this.listaPacientes = this.listaPacientes.filter(p => p.id !== id);
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El paciente ha sido eliminado.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#3085d6'
            });
          },
          (error) => {
            console.error('Error al eliminar el paciente:', error);
            Swal.fire({
              title: '¡Error!',
              text: 'Hubo un problema al eliminar el paciente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#d33'
            });
          }
        );
      }
    });
  }

  verDetalles(paciente: any): void {
    Swal.fire({
      title: `Detalles de ${paciente.nombre}`,
      html: `
        <strong>ID:</strong> ${paciente.id} <br>
        <strong>Nombre:</strong> ${paciente.nombre} <br>
        <strong>Edad:</strong> ${paciente.edad} <br>
        <strong>Sexo:</strong> ${paciente.sexo} <br>
        <strong>Dirección:</strong> ${paciente.direccion} <br>
        <strong>Teléfono:</strong> ${paciente.telefono} <br>
      `,
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }
}

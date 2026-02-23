import { Component } from '@angular/core';

@Component({
  selector: 'app-macros',
  standalone: false,
  templateUrl: './macros.component.html',
  styleUrls: ['./macros.component.css']
})
export class MacrosComponent {
  macrosData = [
    { nombre: 'Pagos en efectivo', archivo: 'assets/macros/EFECTIVO.zip' },
    { nombre: 'Transferencias ACH', archivo: 'assets/macros/ACH.zip' },
    { nombre: 'Proveedores', archivo: 'assets/macros/PROV.zip' },
    { nombre: 'Haberes', archivo: 'assets/macros/PDH.zip' },
    { nombre: 'Pagos YAPE', archivo: 'assets/macros/YAPE.zip' },
    { nombre: 'Pagos Multiples', archivo: 'assets/macros/PMM.zip' },
    { nombre: 'Comisiones', archivo: 'assets/macros/Comisiones.zip' },
    { nombre: 'Bonos', archivo: 'assets/macros/Bonos.zip' },
    { nombre: 'Servicios', archivo: 'assets/macros/Servicios.zip' },
  ];

  currentPage = 1;
  perPage = 6;

  get totalPages(): number {
    return Math.ceil(this.macrosData.length / this.perPage);
  }

  get paginatedMacros() {
    const start = (this.currentPage - 1) * this.perPage;
    return this.macrosData.slice(start, start + this.perPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // Método para descargar archivos usando fetch + blob
  async downloadMacro(macro: { nombre: string; archivo: string }) {
    try {
      const response = await fetch(macro.archivo);
      if (!response.ok) throw new Error('Error al descargar el archivo');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = macro.archivo.split('/').pop() || 'archivo.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      //console.error('Error al descargar:', error);
      alert('No se pudo descargar el archivo. Intenta de nuevo.');
    }
  }
}

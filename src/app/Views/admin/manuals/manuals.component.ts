import { Component } from '@angular/core';

@Component({
  selector: 'app-manuals',
  standalone: false,
  templateUrl: './manuals.component.html',
  styleUrl: './manuals.component.css'
})
export class ManualsComponent {

async downloadManual() {
  const fileUrl = 'assets/macros/Nuevo_manual_de_usuario_CW.pdf';  // ruta fija de tu archivo
  const fileName = 'Nuevo_manual_de_usuario_CW.pdf';               // nombre que quieres al descargar

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Error al descargar el archivo');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    //console.error('Error al descargar:', error);
    alert('No se pudo descargar el archivo. Intenta de nuevo.');
  }
}
}

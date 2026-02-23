// img-modal.component.ts
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-img-modal',
  standalone: false,
  templateUrl: './img-modal.component.html',
  styleUrl: './img-modal.component.css'
})
export class ImgModalComponent implements OnInit, OnDestroy {
  isLoading = true;
  hasError = false;

  constructor(
    public dialogRef: MatDialogRef<ImgModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { imageUrl: string }
  ) {}

  ngOnInit(): void {
    // Bloquear scroll del body
    document.body.classList.add('modal-open');

    // Cerrar modal con tecla ESC
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.close();
      }
    });

    // Cerrar modal al hacer clic en el backdrop
    this.dialogRef.backdropClick().subscribe(() => {
      this.close();
    });
  }

  ngOnDestroy(): void {
    // Restaurar scroll del body
    document.body.classList.remove('modal-open');
  }

  close(): void {
    // Restaurar scroll antes de cerrar
    document.body.classList.remove('modal-open');
    this.dialogRef.close();
  }

  // Manejar la carga exitosa de la imagen
  onImageLoad(): void {
    this.isLoading = false;
    this.hasError = false;
  }

  // Manejar error al cargar la imagen
  onImageError(): void {
    this.isLoading = false;
    this.hasError = true;
  }

  // Prevenir propagación del click en la imagen
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}

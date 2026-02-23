// breaking-news.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImgModalComponent } from '../components/img-modal/img-modal.component';

@Component({
  selector: 'app-breaking-news',
  standalone: false,
  templateUrl: './breaking-news.component.html',
  styleUrl: './breaking-news.component.css'
})
export class BreakingNewsComponent {
  constructor(private dialog: MatDialog) {}

  // Lista de imágenes
  noticias = [
    'assets/img/new-news/new-news-1.png',
    'assets/img/new-news/new-fx-1.png',
    'assets/img/new-news/olivia-1.png',
    'assets/img/new-news/arte-fin-1.png',
    'assets/img/new-news/img-report-1.png'
  ];
 /*  openImageModal(imgSrc: string) {
    const dialogRef = this.dialog.open(ImgModalComponent, {
      data: { imageUrl: imgSrc },
      panelClass: 'image-modal',
      hasBackdrop: true,
      backdropClass: 'modal-backdrop',
      disableClose: false,
      autoFocus: false,
      maxWidth: 'none',
      maxHeight: 'none',
      width: 'auto',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe(() => {
      ////console.log('Modal cerrado');

      document.body.classList.remove('modal-open');
    });
  } */
openImageModal(imgSrc: string) {
  const dialogRef = this.dialog.open(ImgModalComponent, {
    data: { imageUrl: imgSrc },
    panelClass: 'custom-image-modal',
    hasBackdrop: true,
    backdropClass: 'custom-modal-backdrop',
    disableClose: false,
    autoFocus: false,
    maxWidth: '90vw',   // ← Cambié de 100vw
    maxHeight: '90vh',  // ← Cambié de 100vh
    width: 'auto',      // ← Cambié a auto
    height: 'auto',     // ← Cambié a auto
  });

  dialogRef.afterClosed().subscribe(() => {
    document.body.classList.remove('modal-open');
  });
}
  onImageError(event: any): void {
    //console.warn('Error cargando imagen:', event.target.src);
  }
}

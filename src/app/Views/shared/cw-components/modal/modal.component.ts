import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() size = 'md';
  @Input() onlyImage = false;
  @Output() onClose = new EventEmitter();
  @Input() manualCloseModal = false;
  @Input() isImgLogin = false;

  visibleAnimate = false;
  sizeClass = '';

  constructor() { /*This is intentional*/ }

  ngOnInit() {
    this.setSizeClass();
  }

  ngOnChanges(changes: SimpleChanges | any) {
    if (changes.visible && changes.visible.currentValue !== undefined) {
      changes.visible.currentValue ? this.show() : this.hide();
    }

    if (changes.size) {
      this.setSizeClass();
    }
  }

  show() {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  hide() {
    this.visibleAnimate = false;
    setTimeout(() => {
      this.visible = false;
      this.onClose.emit(false);
    }, 300);
  }

  onContainerClicked(event: MouseEvent) {
    if (!this.manualCloseModal) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-backdrop')) {
        this.onClose.emit(false);
      }
    }
  }

  handleClose() {
    this.onClose.emit(false);
  }

  private setSizeClass() {
    const sizeMap: { [key: string]: string } = {
      'sm': 'max-w-sm w-full',
      'md': 'max-w-lg w-full',
      'lg': 'max-w-2xl w-full',
      'xl': 'max-w-4xl w-full'
    };

    if (this.onlyImage) {
      // Para modales de imagen, ajustamos el tamaño más preciso
      this.sizeClass = 'max-w-3xl w-auto';
    } else {
      this.sizeClass = sizeMap[this.size] || sizeMap['md'];
    }
  }

  getModalContentClasses(): string {
    let classes = 'relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out overflow-hidden';

    if (this.isImgLogin) {
      classes += ' modal_boleta';
    }

    return classes;
  }

  getModalBodyClasses(): string {
    if (this.onlyImage) {
      return 'p-0';
    }
    return 'px-6 pb-2';
  }

  getModalFooterClasses(): string {
    if (this.onlyImage) {
      return 'p-0';
    }
    return 'px-6 pb-6 pt-4';
  }

  getModalHeaderClasses(): string {
    if (this.onlyImage) {
      return 'hidden';
    }
    return 'px-6 pt-6 pb-4 flex-shrink-0';
  }
}

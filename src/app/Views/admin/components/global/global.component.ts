import { Component, OnInit } from '@angular/core';
import { MessageModel, MessageType } from '../../../../Services/shared/models/message-model';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NavigationStart } from '@angular/router';

@Component({
  selector: 'app-global',
  standalone: false,
  templateUrl: './global.component.html',
  styleUrl: './global.component.css'
})
export class GlobalComponent implements OnInit {
  messages: MessageModel[] = [];
  currentMessage: MessageModel = new MessageModel();
  loadings = new Array<boolean>();
  loading = false;
  timeShowMessage = 4500;
  mens!: NavigationStart;

  constructor(private globalService: GlobalService) {}

  ngOnInit() {
    this.globalService.getMessage().subscribe({
      next: (message: MessageModel) => {
        if (!message) {
          this.messages = [];
          return;
        }
        if (message.isVisible) {
          this.messages.push(message);
          if (message.isModalContainer) {
            setTimeout(() => (this.currentMessage = message), 10);
          } else {
            setTimeout(() => (message.isVisible = true), 10);
            setTimeout(
              () => setTimeout(this.removeMessage(message)!),
              this.timeShowMessage
            );
          }
        }
      },
    });

    this.globalService.getLoader().subscribe({
      next: (isLoading: boolean) => {
        if (isLoading) {
          this.loadings.push(isLoading);
        } else {
          this.loadings.pop();
        }
        if (this.loadings.length == 0) {
          this.loadings = new Array<boolean>();
          this.loading = false;
        } else {
          this.loading = true;
        }
      },
    });
  }

  removeMessage(message: MessageModel) {
    message.isVisible = false;
    if (message.isModalContainer) {
      this.messages = this.messages.filter((x) => x !== message);
      if (this.messages.length !== 0) {
        this.currentMessage = this.messages[0];
      }
    } else {
      setTimeout(
        () => (this.messages = this.messages.filter((x) => x !== message)),
        400
      );
    }
  }

  cssClass(message: MessageModel): string {
    if (!message) {
      return '';
    }

    // Para compatibilidad con código anterior que use Bootstrap
    switch (message.type) {
      case MessageType.Success:
        return 'success';
      case MessageType.Error:
        return 'danger';  // Bootstrap usa 'danger' en lugar de 'error'
      case MessageType.Info:
        return 'info';
      case MessageType.Warning:
        return 'warning';
      default:
        return 'secondary';
    }
  }

  // Nueva función para Tailwind CSS que devuelve las clases completas
  getTailwindAlertClass(message: MessageModel): string {
    if (!message) {
      return 'bg-gray-100 text-gray-700 border border-gray-300';
    }

    // Devuelve las clases de Tailwind apropiadas según el tipo de mensaje
    switch (message.type) {
      case MessageType.Success:
        return 'bg-green-100 text-green-800 border border-green-200';
      case MessageType.Error:
        return 'bg-red-100 text-red-800 border border-red-200';
      case MessageType.Info:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case MessageType.Warning:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  }

  // Alternativa con objeto de clases si prefieres
  getTailwindAlertClassObject(message: MessageModel): any {
    if (!message) {
      return {
        'bg-gray-100': true,
        'text-gray-700': true,
        'border': true,
        'border-gray-300': true
      };
    }

    const classes = {
      'bg-green-100': message.type === MessageType.Success,
      'text-green-800': message.type === MessageType.Success,
      'border-green-200': message.type === MessageType.Success,

      'bg-red-100': message.type === MessageType.Error,
      'text-red-800': message.type === MessageType.Error,
      'border-red-200': message.type === MessageType.Error,

      'bg-blue-100': message.type === MessageType.Info,
      'text-blue-800': message.type === MessageType.Info,
      'border-blue-200': message.type === MessageType.Info,

      'bg-yellow-100': message.type === MessageType.Warning,
      'text-yellow-800': message.type === MessageType.Warning,
      'border-yellow-200': message.type === MessageType.Warning,

      'border': true
    };

    return classes;
  }

  /* cssClass(message: MessageModel): string {
    if (!message) {
      return '';
    }
    //console.log('message', message)
    switch (message.type) {
      case MessageType.Success:
        return 'green';
      case MessageType.Error:
        return 'red';
      case MessageType.Info:
        return 'blue';
      case MessageType.Warning:
        return 'yellow';
      default:
        return 'gray';
    }
  } */

  showAlert(_$event: any) {
    // This is intentional
  }
}

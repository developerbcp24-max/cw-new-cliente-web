import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Event, NavigationStart, Router } from '@angular/router';
import { Observable, Subject  } from 'rxjs';
import { MessageModel, MessageType } from './models/message-model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private subject = new Subject<MessageModel>();
  private subjectLoader = new Subject<boolean>();

  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    router.events.subscribe({next: (event: Event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.clearMessage(event);
        }
      }
    }});
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  getLoader(): Observable<any> {
    return this.subjectLoader.asObservable();
  }

  success(summary: string, detail: string, isModalContainer = false, keepAfterRouteChange = false) {
    this.showMessage(MessageType.Success, summary, detail, isModalContainer, keepAfterRouteChange);
  }

  danger(summary: string, detail: string, isModalContainer = false, keepAfterRouteChange = false) {
    this.showMessage(MessageType.Error, summary, detail, isModalContainer, keepAfterRouteChange);
  }

  info(summary: string, detail: string, isModalContainer = false, keepAfterRouteChange = false) {
    this.showMessage(MessageType.Info, summary, detail, isModalContainer, keepAfterRouteChange);
  }

  warning(summary: string, detail: string, isModalContainer = false, keepAfterRouteChange = false) {
    this.showMessage(MessageType.Warning, summary, detail, isModalContainer, keepAfterRouteChange);
  }

  private showMessage(type: MessageType, summary: string, detail: string, isModalContainer: boolean, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<MessageModel>{
      'type': type,
      'summary': summary,
      'detail': detail,
      'isModalContainer': isModalContainer,
      'isVisible': true
    });
  }

  public showLoader(loading: boolean = false): void {
    this.subjectLoader.next((loading));
  }

  private clearMessage(message: any): void {
    this.subject.next(message);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}


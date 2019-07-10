import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private appName: string;
  private displayTime = 3000;
  private success = 'Succès';
  private info = 'Information';
  private warning = 'Warning';
  private error = 'Erreur';

  constructor(private messageService: MessageService) {
  }


  showSuccess(message) {
    this.messageService.add({
      severity: 'success',
      life: this.displayTime,
      summary: this.success,
      detail: message
    });
  }

  showSuccessCustom(summary, message) {
    this.messageService.add({
      severity: 'success',
      life: this.displayTime,
      summary: summary,
      detail: message
    });
  }

  showInfo(message) {
    this.messageService.add({
      severity: 'info',
      life: this.displayTime,
      summary: this.info,
      detail: message
    });
  }

  showWarning(message) {
    this.messageService.add({
      severity: 'warn',
      life: this.displayTime,
      summary: this.warning,
      detail: message
    });
  }

  showError(message) {
    this.messageService.add({
      severity: 'error',
      life: this.displayTime,
      summary: this.error,
      detail: message
    });
  }

  showErrorCustom(summary, message) {
    this.messageService.add({
      severity: 'error',
      life: this.displayTime,
      summary: summary,
      detail: message
    });
  }


  showConfirm() {
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: 'Etes vous sûr?',
      detail: 'Confirmez l\'action'
    });
  }


  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  clear() {
    this.messageService.clear();
  }
}

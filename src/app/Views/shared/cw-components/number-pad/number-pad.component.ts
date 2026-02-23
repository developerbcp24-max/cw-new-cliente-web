import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConfig } from '../../../../app.config';

@Component({
  selector: 'app-number-pad',
  standalone: false,
  templateUrl: './number-pad.component.html',
  styleUrl: './number-pad.component.css'
})
export class NumberPadComponent implements OnInit {
  list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  numberToken: any;
  isValidKey = false;
  @Input() maxLength: number = 0;
  @Input() isPin!: boolean;
  @Output() onChangeText = new EventEmitter();
  @Input() disabled = false;
  @Input() isTokenVU = false;
  visibleCode = false;

  constructor(private config: AppConfig) {
    this.resetPad();
  }

  ngOnInit() {
    /*if (this.isPin) {
      this.maxLength = 4;
    } else {
      this.maxLength = +this.config.getConfig('padTokenLength');
    }*/
  }

  handleOnClick($number: any) {
    this.isValidKey = (this.numberToken + $number).length >= this.maxLength;
    if ((this.numberToken + $number).length <= this.maxLength) {
      this.numberToken = this.numberToken + $number;
      this.onChangeText.emit(this.numberToken);
    }
    return false;
  }

  handleOnClickLimpiar() {
    this.isValidKey = false;
    this.numberToken = '';
    this.onChangeText.emit(this.numberToken);
    return false;
  }

  isValid() {
    return this.isValidKey;
  }

  resetPin() {
    this.numberToken = '';
  }

  resetPad() {
    this.isValidKey = false;
    this.numberToken = '';
    const { list } = this;
    let currentIndex = list.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = this.getSecureRandomIndex(currentIndex);

      currentIndex -= 1;
      temporaryValue = list[currentIndex];
      list[currentIndex] = list[randomIndex];
      list[randomIndex] = temporaryValue;
    }
    return list;
  }
  getSecureRandomIndex(max: number): number {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  showHideCode() {
    this.visibleCode = !this.visibleCode;
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-virtual-path',
  standalone: false,
  templateUrl: './virtual-path.component.html',
  styleUrl: './virtual-path.component.css'
})
export class VirtualPathComponent implements OnInit {

  keyboard: any[];
  select = 0;
  textValue = '';
  @Output() onKeyChange = new EventEmitter();
  constructor() {
    this.keyboard = [
      [[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4], [5, 5, 5], [6, 6, 6], [7, 7, 7], [8, 8, 8], [9, 9, 9], [0, 0, 0]],
      [['q', 'Q', '!'], ['w', 'W', '@'], ['e', 'E', '#'], ['r', 'R', '$'], ['t', 'T', '%'], ['y', 'Y', '/'], ['u', 'U', '('], ['i', 'I', ')'], ['o', 'O', '='], ['p', 'P', '?']],
      [['a', 'A', '['], ['s', 'S', ']'], ['d', 'D', '¿'], ['f', 'F', '}'], ['g', 'G', '!'], ['h', 'H', '-'], ['j', 'J', ':'], ['k', 'K', ';'], ['l', 'L', ','], ['.', '.', '.']],
      [['shift', 'shift', 'shift'], ['?#', '?#', 'abc'], ['z', 'Z', '-'], ['x', 'X', '_'], ['c', 'C', '*'], ['v', 'V', '°'], ['b', 'B', '¬'], ['n', 'N', '^'], ['m', 'M', '~'], ['back', 'back', 'back']]
    ];
  }

  ngOnInit(): void {
    // This is intentional
  }
  handleKeyPress(key: any) {
    switch (key) {
      case 'shift':
        this.select = this.select === 1 ? 0 : 1;
        break;
      case '?#':
        this.select = 2;
        break;
      case 'abc':
        this.select = 0;
        break;
      case 'back':
        this.textValue = this.textValue.substring(0, this.textValue.length - 1);
        this.onKeyChange.emit(key);
        break;
      default:
        this.textValue = this.textValue + key;
        this.onKeyChange.emit(key);
        break;
    }
    return false;
  }
}

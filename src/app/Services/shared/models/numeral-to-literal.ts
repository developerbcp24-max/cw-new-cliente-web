export class NumberToLiteral {

  private units(num: any) {

    switch (num) {
      case 1: return 'UN';
      case 2: return 'DOS';
      case 3: return 'TRES';
      case 4: return 'CUATRO';
      case 5: return 'CINCO';
      case 6: return 'SEIS';
      case 7: return 'SIETE';
      case 8: return 'OCHO';
      case 9: return 'NUEVE';
    }
    return '';
  }

  private tens(num: any) {

    const ten = Math.floor(num / 10);
    const unit = num - (ten * 10);

    switch (ten) {
      case 1:
        switch (unit) {
          case 0: return 'DIEZ';
          case 1: return 'ONCE';
          case 2: return 'DOCE';
          case 3: return 'TRECE';
          case 4: return 'CATORCE';
          case 5: return 'QUINCE';
          default: return 'DIECI' + this.units(unit);
        }
      case 2:
        if (unit == 0){
          return 'VEINTE';
        }else{
          return 'VEINTI' + this.units(unit);
        }
      case 3: return this.tensY('TREINTA', unit);
      case 4: return this.tensY('CUARENTA', unit);
      case 5: return this.tensY('CINCUENTA', unit);
      case 6: return this.tensY('SESENTA', unit);
      case 7: return this.tensY('SETENTA', unit);
      case 8: return this.tensY('OCHENTA', unit);
      case 9: return this.tensY('NOVENTA', unit);
      case 0: return this.units(unit);
    }
  }

  private tensY(strSin: any, numUnits: any) {
    if (numUnits > 0) {
      return strSin + ' Y ' + this.units(numUnits);
    }

    return strSin;
  }

  private hundreds(num: any) {
    const hundreds = Math.floor(num / 100);
    const tens = num - (hundreds * 100);

    switch (hundreds) {
      case 1:
        if (tens > 0) {
          return 'CIENTO ' + this.tens(tens);
        }
        return 'CIEN';
      case 2: return 'DOSCIENTOS ' + this.tens(tens);
      case 3: return 'TRESCIENTOS ' + this.tens(tens);
      case 4: return 'CUATROCIENTOS ' + this.tens(tens);
      case 5: return 'QUINIENTOS ' + this.tens(tens);
      case 6: return 'SEISCIENTOS ' + this.tens(tens);
      case 7: return 'SETECIENTOS ' + this.tens(tens);
      case 8: return 'OCHOCIENTOS ' + this.tens(tens);
      case 9: return 'NOVECIENTOS ' + this.tens(tens);
    }
    return this.tens(tens);
  }

  private Section(num: any, divisor: any, strSingular: any, strPlural: any) {
    const hundreds = Math.floor(num / divisor);
    const resto = num - (hundreds * divisor);

    let letters = '';

    if (hundreds > 0) {
      if (hundreds > 1) {
        letters = this.hundreds(hundreds) + ' ' + strPlural;
      } else {
        letters = strSingular;
      }
    }

    if (resto > 0) {
      letters += '';
    }
    return letters;
  }

  private thousands(num: any) {
    const divisor = 1000;
    const hundreds = Math.floor(num / divisor);
    const resto = num - (hundreds * divisor);

    const strThousands = this.Section(num, divisor, 'UN MIL', 'MIL');
    const strHundreds = this.hundreds(resto);

    if (strThousands === '') {
      return strHundreds;
    }

    return strThousands + ' ' + strHundreds;
  }

  private millions(num: any) {
    const divisor = 1000000;
    const hundreds = Math.floor(num / divisor);
    const resto = num - (hundreds * divisor);

    const strMillions = this.Section(num, divisor, 'UN MILLON', 'MILLONES');
    const strThousands = this.thousands(resto);

    if (strMillions === '') {
      return strThousands;
    }

    return strMillions + ' ' + strThousands;
  }

  convertToLiteral(number: number) {
    const data = {
      numbers: number,
      integers: Math.floor(number),
      cents: ((Math.round(number * 100)) - (Math.floor(number) * 100)),
      centsLiteral: '',
    };
    if (data.cents > 0) {
      data.centsLiteral = (data.cents < 10 && data.cents > 0) ? '0' + data.cents + '/100' : data.cents + '/100';
    } else {
      data.centsLiteral = '00/100';
    }

    if (data.integers === 0) {
      return 'CERO' + ' ' + data.centsLiteral;
    }
    return this.millions(data.integers) + ' ' + data.centsLiteral;
  }
}

export class Converter {
  private static unity(nombre) {
    let unityStr;
    switch (nombre) {
      case 0: unityStr = 'zéro'; break;
      case 1: unityStr = 'un'; break;
      case 2: unityStr = 'deux'; break;
      case 3: unityStr = 'trois'; break;
      case 4: unityStr = 'quatre'; break;
      case 5: unityStr = 'cinq'; break;
      case 6: unityStr = 'six'; break;
      case 7: unityStr = 'sept'; break;
      case 8: unityStr = 'huit'; break;
      case 9: unityStr = 'neuf'; break;
    }
    return unityStr;
  }

  private static decade(nombre) {
    let decadeStr;
    switch (nombre) {
      case 10: decadeStr = 'dix'; break;
      case 11: decadeStr = 'onze'; break;
      case 12: decadeStr = 'douze'; break;
      case 13: decadeStr = 'treize'; break;
      case 14: decadeStr = 'quatorze'; break;
      case 15: decadeStr = 'quinze'; break;
      case 16: decadeStr = 'seize'; break;
      case 17: decadeStr = 'dix-sept'; break;
      case 18: decadeStr = 'dix-huit'; break;
      case 19: decadeStr = 'dix-neuf'; break;
      case 20: decadeStr = 'vingt'; break;
      case 30: decadeStr = 'trente'; break;
      case 40: decadeStr = 'quarante'; break;
      case 50: decadeStr = 'cinquante'; break;
      case 60: decadeStr = 'soixante'; break;
      case 70: decadeStr = 'soixante-dix'; break;
      case 80: decadeStr = 'quatre-vingt'; break;
      case 90: decadeStr = 'quatre-vingt-dix'; break;
    }
    return decadeStr;
  }

  public static numberToLetter(nombre) {
    let n, quotient, reste, nb;
    let numberToLetterStr = '';
    if (nombre.toString().replace(/ /gi, '').length > 15) {
      return 'dépassement de capacité';
    }
    if (isNaN(nombre.toString().replace(/ /gi, ''))) {
      return 'Nombre non valide';
    }

    nb = parseFloat(nombre.toString().replace(/ /gi, ''));
    if (Math.ceil(nb) !== nb) {
      return 'Nombre avec virgule non géré.';
    }

    n = nb.toString().length;
    switch (n) {
      case 1: numberToLetterStr = Converter.unity(nb); break;
      case 2: if (nb > 19) {
        quotient = Math.floor(nb / 10);
        reste = nb % 10;
        if (nb < 71 || (nb > 79 && nb < 91)) {
          if (reste === 0) {
            numberToLetterStr = Converter.decade(quotient * 10);
          }
          if (reste === 1) {
            numberToLetterStr = Converter.decade(quotient * 10) + '-et-' + Converter.unity(reste);
          }
          if (reste > 1) {
            numberToLetterStr = Converter.decade(quotient * 10) + '-' + Converter.unity(reste);
          }
        } else {
          numberToLetterStr = Converter.decade((quotient - 1) * 10) + '-' + Converter.decade(10 + reste);
        }
      } else {
        numberToLetterStr = Converter.decade(nb);
      }
        break;
      case 3: quotient = Math.floor(nb / 100);
        reste = nb % 100;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'cent';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'cent ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = ' ' + Converter.unity(quotient) + ' cents';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = ' ' + Converter.unity(quotient) + ' cent ' + Converter.numberToLetter(reste);
        }
        break;
      case 4: quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'mille ';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'mille ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' mille ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' mille ';
        }
        break;
      case 5: quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'mille ';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'mille ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' mille ';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' mille ' + Converter.numberToLetter(reste);
        }
        break;
      case 6: quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'mille ';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'mille ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' mille ';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' mille' + Converter.numberToLetter(reste);
        }
        break;
      case 7: quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un million';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un million ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' millions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' millions ' + Converter.numberToLetter(reste);
        }
        break;
      case 8: quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un million';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un million ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' millions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' millions ' + Converter.numberToLetter(reste);
        }
        break;
      case 9: quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un million';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un million ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' millions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' millions ' + Converter.numberToLetter(reste);
        }
        break;
      case 10: quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un milliard';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un milliard ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' milliards';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' milliards ' + Converter.numberToLetter(reste);
        }
        break;
      case 11: quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un milliard';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un milliard ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' milliards';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' milliards ' + Converter.numberToLetter(reste);
        }
        break;
      case 12: quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un milliard';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un milliard ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' milliards';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' milliards ' + Converter.numberToLetter(reste);
        }
        break;
      case 13: quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un billion';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un billion ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' billions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' billions ' + Converter.numberToLetter(reste);
        }
        break;
      case 14: quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un billion';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un billion ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' billions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' billions ' + Converter.numberToLetter(reste);
        }
        break;
      case 15: quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetterStr = 'un billion';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetterStr = 'un billion ' + Converter.numberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' billions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetterStr = Converter.numberToLetter(quotient) + ' billions ' + Converter.numberToLetter(reste);
        }
        break;
    }
    /*respect de l'accord de quatre-vingt*/
    if (numberToLetterStr.substr(numberToLetterStr.length - 'quatre-vingt'.length, 'quatre-vingt'.length) === 'quatre-vingt') {
      numberToLetterStr = numberToLetterStr + 's';
    }

    return numberToLetterStr;

  }
}


import { Injectable } from '@angular/core';
import { CODE_LENGTH } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class GenericUtilService {
  constructor() {}

  /**
   * Generates a random string of size CODE_LENGTH
   *
   * @return code: string - the randomized code
   */
  generateRandomCode(): string {
    let code = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;

    for (let i = 0; i < CODE_LENGTH; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return code;
  }
}

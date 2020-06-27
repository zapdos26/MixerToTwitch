import * as CryptoJS from 'crypto-js'

export class EncryptionHelper {
  static decrypt(message: string, key: string): string {
    return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8)
  }

  static encrypt(message: string, key: string): string {
    return CryptoJS.AES.encrypt(message, key).toString()
  }

}

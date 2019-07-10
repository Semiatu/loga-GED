import {Component} from '@angular/core';

import {locale as english} from './i18n/en';
import {locale as turkish} from './i18n/tr';
import {locale as french} from '../../../bridge/navigation/i18n/fr';
import {FuseTranslationLoaderService} from "../../@fuse/services/translation-loader.service";

@Component({
  selector: 'sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent {
  /**
   * Constructor
   *
   * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
   */
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, turkish, french);
  }
}

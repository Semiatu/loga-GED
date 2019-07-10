import {Component} from '@angular/core';
import {config} from '../../../../bridge/config';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  config: any;
  /**
   * Constructor
   */
  constructor() {
    this.config = config;
  }
}

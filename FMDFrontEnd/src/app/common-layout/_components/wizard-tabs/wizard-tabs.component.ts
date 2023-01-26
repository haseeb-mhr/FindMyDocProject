import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-wizard-tabs',
  templateUrl: './wizard-tabs.component.html',
  styleUrls: ['./wizard-tabs.component.sass']
})
export class WizardTabsComponent {
  @Input() wizardTabs: string[];
  @Input() currentIndex = 0;
  @Output() currentIndexEmitter = new EventEmitter<Number>();

  constructor() { }

  wizardButtonClick(tabIndex: number) {
    this.currentIndexEmitter.emit(tabIndex);
  }
}

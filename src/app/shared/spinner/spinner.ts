// shared/spinner/spinner.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.html'
})
export class Spinner {
  @Input() message: string = 'Loading...';  // customizable text
  @Input() fullScreen: boolean = false;     // overlay whole page or inline
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // size variants

  get spinnerSize(): string {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  return sizes[this.size];
}
}
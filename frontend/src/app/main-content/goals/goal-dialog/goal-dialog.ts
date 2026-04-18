import { Component, ChangeDetectionStrategy, inject, output, ElementRef, ViewChild, AfterViewInit, ApplicationRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoalService, UtilService } from '@services';
import { ModalComponent, ButtonComponent } from '@atoms';
import { ButtonType } from '@constants';

@Component({
  selector: 'pt-goal-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './goal-dialog.html',
  styleUrl: './goal-dialog.css',
})
export class GoalDialog implements AfterViewInit {
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  
  ButtonType = ButtonType;

  private readonly goalService = inject(GoalService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  readonly close = output<void>();

  readonly goalForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    targetDate: new FormControl('', Validators.required),
  });

  ngAfterViewInit(): void {
    setTimeout(() => { this.titleInput?.nativeElement?.focus(); }, 50);
  }

  addGoal(): void {
    if (this.goalForm.invalid) return;
    const val = this.goalForm.value;

    this.utils.transition(this.appRef, () => {
      this.goalService.addGoal(val.title!, val.description || '', val.targetDate!);
    });

    this.close.emit();
  }

  onCancel(): void {
    this.close.emit();
  }
}

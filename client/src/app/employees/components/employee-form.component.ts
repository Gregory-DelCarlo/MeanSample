import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../employee';

//ng g component employees/components/employee-form --flat -m app
// we are going to use FormBuilder from ReactiveFormsModule to build a reactive form for
// creating new employees and editing existing ones
@Component({
  selector: 'app-employee-form',
  template: `
   <form class="employee-form"
          autocomplete="off"
          [formGroup]="employeeForm"
          (ngSubmit)="submitForm()">
    <!--Input div for the Name field -->
    <div class="form-flaoting mb-3">
      <input class="form-control"
              type="text"
              id="name"
              formControlName="name"
              placeholder="Name" required>
      <label for="name">Name</label>
    </div>
    <!-- Conditional div that renders only if there is an error in the field -->
    <div *ngIf="name.invalid && (name.dirty || name.touched)"
          class="alert alert-danger">
      <div *ngIf="name.errors?.['required']">
        Name is required.
      </div>
      <div *ngIf="name.errors?.['minLength']">
        Name must be at least 3 characters long.
      </div>
    </div>
    <!--Input div for the Position field -->
    <div class="form-floating mb-3">
      <input class="form-control"
              type="text"
              formControlName="position"
              placeholder="Position" required>
      <label for="position">Position</label>
    </div>
    <!-- Conditional div that renders only if there is an error in the position field -->
    <div *ngIf="position.invalid && (position.dirty || position.touched)"
          class="alert alert-danger">
      <div *ngIf="position.errors?.['required']">
        Position is required
      </div>
    </div>

    <!-- Create a checklist to ensure only the correct titles are chosen from" -->
    <div class="mb-3">
      <div class="form-check">
        <input class="form-check-input"
                type="radio"
                formControlName="level"
                name="level"
                id="level-junior"
                value="junior" required>
        <label class="form-check-label"
                for="level-junior">Junior</label>
      </div>
      <div class="form-check">
        <input class="form-check-input"
                type="radio"
                formControlName="level"
                name="level"
                id="level-mid"
                value="mid" required>
        <label class="form-check-label"
                for="level-mid">Mid</label>
      </div>
      <div class="form-check">
        <input class="form-check-input"
                type="radio"
                formControlName="level"
                name="level"
                id="level-senior"
                value="senior" required>
        <label class="form-check-label"
                for="level-senior">Senior</label>
      </div>
    </div>
    <!-- Submit Button -->
    <button class="btn btn-primary"
              type="submit"
              [disabled]="employeeForm.invalid">Add</button> 
   </form>
  `,
  styles: [
    `.employee-form {
      max-width: 560px;
      margin-left: auto;
      margin-right: auto;
    }`
  ]
})
export class EmployeeFormComponent implements OnInit {
  @Input()
  initialState: BehaviorSubject<Employee> = new BehaviorSubject({});

  @Output()
  formValuesChanged = new EventEmitter<Employee>();

  @Output()
  formSubmitted = new EventEmitter<Employee>();

  employeeForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  get name() { return this.employeeForm.get('name')!; }
  get position() { return this.employeeForm.get('position')!; }
  get level() { return this.employeeForm.get('level')!; }

  ngOnInit() {
    this.initialState.subscribe(employee => {
      this.employeeForm = this.fb.group({
        name: [ employee.name, [Validators.required] ],
        position: [ employee.position, [ Validators.required, Validators.minLength(5) ] ],
        level: [ employee.level, [Validators.required] ]
      });
    });

    this.employeeForm.valueChanges.subscribe((val) => {
      this.formValuesChanged.emit(val);
    });
  }

  submitForm() {
    this.formSubmitted.emit(this.employeeForm.value);
  }

}

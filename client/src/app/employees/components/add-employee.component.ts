import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-add-employee',
  template: `
    <h2 class="text-center m-5">Add a New Employee</h2>
    <!-- Create a employee-form with the proper submit event" -->
    <app-employee-form (formSubmitted)="addEmployee($event)"></app-employee-form>
  `,
  styles: [
  ]
})
export class AddEmployeeComponent {

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  addEmployee(employee: Employee) {
    this.employeeService.createEmployee(employee) //emits an event
      .subscribe({
        next: () => {
          this.router.navigate(['/employees']); // return to all after creating a new employee
        },
        error: (error) => {
          alert("Failed to create employee");
          console.error(error);
        }
      });
  }

}

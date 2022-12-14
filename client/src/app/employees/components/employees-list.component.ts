import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../employee';
import { EmployeeService } from '../services/employee.service';

//generated using: ng g component employees/components/employees-list --flat
@Component({
  selector: 'app-employees-list', // this is the html tag that the component ill be rendered on
  // this is where you write your html file and can embed ts
  template: `
    <!--use bootstrap classes-->
    <h2 class="text-center m-5">Employees List</h2>

    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>Level</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let employee of employees$ | async">
          <td>{{employee.name}}</td>
          <td>{{employee.position}}</td>
          <td>{{employee.level}}</td>
          <td>
            <button class="btn btn-primary me-1"
                    [routerLink]="['edit/', employee._id]">Edit</button>
            <button class="btn btn-primary me-1"
                    (click)="deleteEmployee(employee._id || '')">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="btn btn-primary mt-3" [routerLink]="['new']">Add a New Employee</button>
  `,
  // add styles to the template
  styles: [
  ]
})
// this is where all of the logic of your component goes
export class EmployeesListComponent implements OnInit {
  employees$: Observable<Employee[]> = new Observable();

  constructor(private employeesService: EmployeeService) { }

  ngOnInit(): void { // called when component is rendered
    this.fetchEmployees();
  }

  deleteEmployee(id: string): void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => this.fetchEmployees()
    });
  }

  private fetchEmployees(): void {
    this.employees$ = this.employeesService.getEmployees();
  }

}

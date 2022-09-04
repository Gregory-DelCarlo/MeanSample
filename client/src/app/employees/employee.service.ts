import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
// this is like your React/utils file
// it handles all requests from the frontend to the /employees endpoint
export class EmployeeService {
  private url = "http://localhost:3000";
  private employees$: Subject<Employee[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  getEmployees(): Subject<Employee[]> { //specify return type
    this.refreshEmployees();
    return this.employees$;
  }
  
  getEmployee(id: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.url}/employees/${id}`);
  }
  
  createEmployee(employee: Employee): Observable<string> {
    return this.httpClient.post(`${this.url}/employees`, employee, { responseType: 'text'});
  }
  
  updateEmployee(id: string, employee: Employee): Observable<string> {
    return this.httpClient.put(`${this.url}/employees/${id}`, employee, {responseType: 'text'});
  }
  
  deleteEmployee(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/employees/${id}`, { responseType: 'text' });
  }

  // gets the full list of Employees
  // we seperate this from #getEmployees so no one can directly access the Employees table
  private refreshEmployees() {
    this.httpClient.get<Employee[]>(`${this.url}/employees`)
      .subscribe(employees => {
        this.employees$.next(employees);
      });
  }
}

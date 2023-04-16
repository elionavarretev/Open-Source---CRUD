
import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from './../models/student';
import {MatTableDataSource} from "@angular/material/table";
import {HttpDataService} from "../services/http-data.service";
import {MatSort} from "@angular/material/sort";
import {NgForm} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import * as _ from "lodash";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  @ViewChild('studentForm', {static: false})
  studentForm!: NgForm;

  studentData!: Student;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'age', 'mobile', 'email', 'address', 'actions']

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  isEditMode = false;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private httpDataService: HttpDataService) {
    this.studentData = {} as Student;
   
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllStudents();
  }


  getAllStudents() {
    this.httpDataService.getList().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  editItem(element: any) {
    this.studentData = _.cloneDeep(element);
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.studentForm.resetForm();
  }

  deleteItem(id: string) {
    this.httpDataService.deleteItem(id).subscribe((reponse: any) => {
      this.dataSource.data = this.dataSource.data.filter((o: any) => {
        return o.id !== id ? o : false;
      });
    });
    console.log(this.dataSource.data);
  }


  addStudent() {
    this.studentData.id = 0;
    this.httpDataService.createItem(this.studentData).subscribe((response: any) => {
      this.dataSource.data.push({...response});
      this.dataSource.data = this.dataSource.data.map((o: any) => { return o; });
    });
  }

  updateStudent() {
    this.httpDataService.updateItem(this.studentData.id, this.studentData).subscribe((response: any) => {
      this.dataSource.data = this.dataSource.data.map((o: any) => {
        if (o.id == response.id) {
          o = response;
        }
        return o;
      });
    });

  }


  onSubmit() {
    if (this.studentForm.form.valid) {
      console.log('valid');
      if (this.isEditMode) {
        console.log('about to update');
        this.updateStudent();
      } else {
        console.log('about to create');
        this.addStudent();
      }
      this.cancelEdit();
    } else {
      console.log('Invalid data');
    }
  }


}

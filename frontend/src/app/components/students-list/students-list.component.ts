import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../../crud/student';
import { ApiService } from '../../crud/api.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.sass']
})
export class StudentsListComponent implements OnInit {
  StudentData: any = [];
  dataSource: MatTableDataSource<Student>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['_id', 'studentName', 'studentEmail', 'section', 'action'];

  constructor(private studentApi: ApiService) {
    this.studentApi.GetStudents().subscribe(data => {
      this.StudentData = data;
      this.dataSource = new MatTableDataSource<Student>(this.StudentData);

      setTimeout(() => this.dataSource.paginator = this.paginator);
    });
  }

  ngOnInit() {}

  deleteStudent(index: number, e) {
    if (window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.studentApi.DeleteStudent(e._id).subscribe();
    }
  }

}

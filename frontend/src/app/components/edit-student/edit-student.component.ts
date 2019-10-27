import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { ApiService } from '../../crud/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.sass']
})

export class EditStudentComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('chipList', { static: false }) chipList;
  @ViewChild('resetStudentForm', { static: false }) myNgForm;
  readonly separatorKeyCodes: number[] = [ENTER, COMMA];
  studentForm: FormGroup;
  subjectArray: Subject[] = [];
  SectionArray: any = ['A', 'B', 'C', 'D', 'E'];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private studentApi: ApiService
  ) {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.studentApi.GetStudent(id).subscribe(data => {
      this.subjectArray = data.subjects;
      this.studentForm = this.fb.group({
        studentName: [data.studentName, [Validators.required]],
        studentEmail: [data.studentEmail, [Validators.required]],
        section: [data.section, [Validators.required]],
        subjects: [data.subjects],
        dob: [data.dob, [Validators.required]],
        gender: [data.gender]
      });
    });
  }

  ngOnInit() {
    this.updateBookForm();
  }

  updateBookForm() {
    this.studentForm = this.fb.group({
      studentName: ['', [Validators.required]],
      studentEmail: ['', [Validators.required]],
      section: ['', [Validators.required]],
      subjects: [this.subjectArray],
      dob: ['', [Validators.required]],
      gender: ['Male']
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({ name: value.trim() });
    }
    if (input) {
      input.value = '';
    }
  }

  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
  }

  formatDate(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.studentForm.get('dob').setValue(convertDate, { onlyself: true });
  }

  public handleError = (controlName: string, errorName: string) =>
    this.studentForm.controls[controlName].hasError(errorName)

  updateStudentForm() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (this.studentForm.valid && window.confirm('Are you sure you want to update?')) {
      this.studentApi.UpdateStudent(id, this.studentForm.value)
        .subscribe(res => this.ngZone.run(
          () => this.router.navigateByUrl('/students-list')
        ));
    }
  }

}

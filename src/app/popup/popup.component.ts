import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MAT_DIALOG_DATA } from '@angular/material/MAT_DIALOG_DATA';
import { MatDialogRef } from '@angular/material/MatDialogRef';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  postForm!: FormGroup;
  actionButton: string = 'Save';
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogref: MatDialogRef<PopupComponent>
  ) {}

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      posttype: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
    if (this.editData) {
      this.actionButton = 'Update';
      this.postForm.controls['title'].setValue(this.editData.title);
      this.postForm.controls['posttype'].setValue(this.editData.posttype);
      this.postForm.controls['date'].setValue(this.editData.date);
      this.postForm.controls['description'].setValue(this.editData.description);
    }
  }
  addDetails() {
    if (!this.editData) {
      if (this.postForm.valid) {
        this.api.postDetails(this.postForm.value).subscribe({
          next: (res) => {
            alert('Details Saved');
            this.postForm.reset();
            this.dialogref.close('Details Saved');
          },
          error: () => {
            alert('Details Save Failed');
          },
        });
      }
    } else {
      this.updateDetails();
    }
  }
  updateDetails() {
    this.api.putDetails(this.postForm.value, this.editData.id).subscribe({
      next: (res) => {
        alert('Details Updated');
        this.postForm.reset();
        this.dialogref.close('updated');
      },
      error: () => {
        alert('error to update');
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Child, Person } from 'src/app/models/person.model';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css'],
})
export class EditPersonComponent implements OnInit {
  personToEdit: Person = {
    id: 1,
    firstName: 'Milena',
    lastName: 'Shissel',
    email: 'milena@gmail.com',
    address: {
      city: 'Netanya',
      street: 'Jerusalem 123',
    },
    children: [
      { name: 'Erez', age: 8 },
      { name: 'Gefen', age: 7 },
    ],
  };

  personForm!: FormGroup;
  firstNameControl!: FormControl;

  get childrenFormArray() {
    const formArray: FormArray<FormGroup> = this.personForm.get("children") as FormArray<FormGroup>
    return formArray.controls
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // this.firstNameControl = this.formBuilder.control(this.personToEdit.firstName, [Validators.required])
    this.personForm = this.formBuilder.group({
      id: [this.personToEdit.id],
      firstName: [
        this.personToEdit.firstName,
        [Validators.required, Validators.maxLength(12)],
      ],
      lastName: [
        this.personToEdit.lastName,
        [Validators.required, Validators.maxLength(12)],
      ],
      email: [this.personToEdit.email, [Validators.required, Validators.email]],
      address: this.createAddress(),
      children: this.createChildrenArray(),
    });

    this.personForm.valueChanges
      .pipe(
        filter((p) => this.personForm.valid),
        debounceTime(500)
      )
      .subscribe((p) => {
        this.save();
      });

    combineLatest([
      this.personForm.get('firstName')?.valueChanges,
      this.personForm.get('lastName')?.valueChanges,
    ])
      .pipe(debounceTime(500))
      .subscribe((x) => {
        console.log(x);
      });
  }

  createChildrenArray() {
    const childrenGroups = [];
    for (const child of this.personToEdit.children) {
      const g = this.createChild(child);
      childrenGroups.push(g);
    }

    return this.formBuilder.array(childrenGroups);
  }

  createChild(c: Child) {
    return this.formBuilder.group({
      name: [c.name],
      age: [c.age, [Validators.min(0)]],
    });
  }

  createAddress() {
    return this.formBuilder.group({
      city: [this.personToEdit.address.city],
      street: [this.personToEdit.address.street],
    });
  }

  save() {
    this.personToEdit = this.personForm.value;
  }
}

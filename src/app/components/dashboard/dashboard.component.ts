import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('dataGridVar', { static: false }) dataGrid: DxDataGridComponent;
  dataSource: any;
  events: Array<string> = [];
  deletedItems = [];
  completeAddress: any;
  showpopup: boolean;
  employeeForm;
  addFlag: boolean;
  editFlag: boolean;
  currentFilter: any;
  showFilterRow: boolean;
  applyFilterTypes: any;
  showHeaderFilter: boolean;

  name: string[];

  constructor(private restservice: RestService, private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: new FormControl('', Validators.required),
      address: this.fb.array([
        this.fb.group({
          street: new FormControl(''),
          suite: new FormControl(''),
          city: new FormControl(''),
          zipcode: new FormControl(''),
        }),
      ]),
      company: new FormControl('', Validators.required),
    });
    this.fetchEmployeeData();
    this.showFilterRow = true;
    this.showHeaderFilter = true;
    this.applyFilterTypes = [
      {
        key: 'auto',
        name: 'Immediately',
      },
      {
        key: 'onClick',
        name: 'On Button Click',
      },
    ];
    this.currentFilter = this.applyFilterTypes[0].key;
  }

  ngOnInit(): void {
    this.refreshDataGrid();
  }

  logEvent(eventName) {
    this.events.unshift(eventName);
  }

  fetchEmployeeData() {
    this.restservice.getData().subscribe((data: any) => {
      this.dataSource = data;
      this.name = this.dataSource.map((i) => i.name);
      console.log(this.name);
      if (data) {
        this.completeAddress = data.map(
          (i) =>
            `${i.address.street},${i.address.suite},${i.address.city},${i.address.zipcode}`
        );
      }
    });
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxButton',
      name: 'addButton',
      options: {
        text: 'Add',
        onClick: this.addNewEmployee.bind(this, 'add'),
      },
    });
  }
  dataGridInstance;
  saveGridInstance(e) {
    this.dataGridInstance = e.component;
  }

  addNewEmployee(flag?, row?) {
    if (flag == 'add') {
      this.showpopup = true;
      this.addFlag = true;
      this.editFlag = false;
    } else {
      this.employeeForm.patchValue({
        name: row.data.name,
        company: row.data.company.name,
      });
      let obj = [
        {
          street: row.data.address.street,
          zipcode: row.data.address.zipcode,
          suite: row.data.address.suite,
          city: row.data.address.city,
        },
      ];
      this.employeeForm.setControl('address', this.setExistingAddress(obj));
      this.showpopup = true;
      this.addFlag = false;
      this.editFlag = true;
    }
  }
  setExistingAddress(data) {
    const formarray = new FormArray([]);
    data.forEach((i) => {
      formarray.push(
        this.fb.group({
          street: i.street,
          suite: i.suite,
          city: i.city,
          zipcode: i.zipcode,
        })
      );
    });
    return formarray;
  }
  createEditEmployee(form) {
    console.log('form', form);
    let formObject = {
      id: form.value.name + Math.random(),
      name: form.value.name,
      company: { name: form.value.company },
      address: {
        street: form.value.address[0].street,
        suite: form.value.address[0].suite,
        zipcode: form.value.address[0].zipcode,
        city: form.value.address[0].city,
      },
    };
    this.dataSource.unshift(formObject);
    console.log(this.dataSource);
    this.refreshDataGrid();
    this.employeeForm.reset();
    this.showpopup = false;
  }

  refreshDataGrid() {
    setTimeout(() => {
      this.dataGrid.instance.refresh();
      this.dataGrid.instance.repaint();
    }, 200);
  }

  deleteEmployee(row) {
    let temp = this.dataSource.filter((i) => i.id == row.data.id);
    console.log('temp', temp);
    this.dataSource = this.dataSource.filter((value) => {
      return value.id != row.data.id;
    });
    this.deletedItems.push(temp[0]);
    console.log('deleteditems', this.deletedItems);
    this.refreshDataGrid();
  }

  restoreEmployee(row) {
    let temp = this.deletedItems.filter((i) => i.id == row.data.id);
    this.dataSource.unshift(temp[0]);
    this.deletedItems = this.deletedItems.filter((value) => {
      return value.id != row.data.id;
    });
  }
  ok(data) {
    console.log(data);
  }
}

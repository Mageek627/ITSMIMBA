import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountPage } from './add-account.page';

describe('AddAccountPage', () => {
  let component: AddAccountPage;
  let fixture: ComponentFixture<AddAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

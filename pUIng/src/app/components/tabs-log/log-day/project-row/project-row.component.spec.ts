import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRowComponent } from './project-row.component';
import { ProjectAutoTypeService } from '../../../../services/project-auto-type.service';

describe('ProjectRowComponent', () => {
  let component: ProjectRowComponent;
  let fixture: ComponentFixture<ProjectRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectRowComponent],
      providers: [ProjectAutoTypeService],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

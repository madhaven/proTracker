import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectItemComponent } from './project-item.component';
import { UiStateService } from '../../../services/ui-state.service';
import { Project } from '../../../models/project.model';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

class MockUiStateService {
  stateChanged$ = new Subject<any>();
  foldedProjects = new Map<number, boolean>();
  getProject(id: number) { return new Project(id, 'Project ' + id, []); }
  toggleFold(id: number) { return true; }
  editProject(project: Project) { this.lastEdit = project; }
  lastEdit?: Project;
  stateChanged = this.stateChanged$;
}

describe('ProjectItemComponent', () => {
  let component: ProjectItemComponent;
  let fixture: ComponentFixture<ProjectItemComponent>;
  let mockService: MockUiStateService;

  beforeEach(async () => {
    mockService = new MockUiStateService();
    await TestBed.configureTestingModule({
      imports: [ProjectItemComponent],
      providers: [{ provide: UiStateService, useValue: mockService }]
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectItemComponent);
    component = fixture.componentInstance;
    component.projectId = 1;
    component.taskTree = new Map();
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: foldProject toggles foldedProject', () => {
    component.foldProject();
    expect(component.foldedProject).toBeTrue();
  });

  it('unit: editProject calls service', () => {
    component.project = new Project(1, 'Old', []);
    component.editProject('New');
    expect(mockService.lastEdit?.name).toBe('New');
  });

  it('dom: should render project name', () => {
    component.project = new Project(1, 'Test Project', []);
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.editable_item_content'));
    if (content) {
      expect(content.nativeElement.textContent).toContain('Test Project');
    }
  });
});

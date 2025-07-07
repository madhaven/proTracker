import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsProjectComponent } from './tabs-project.component';
import { UiStateService } from '../../services/ui-state.service';
import { Project } from '../../models/project.model';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ProjectItemComponent } from './project-item/project-item.component';
import { CommonModule, NgForOf } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

class MockUiStateService {
  stateChanged$ = new Subject<any>();
  projects = new Map<number, Project>();
  projectTree = new Map<number, Map<number, number>>();
  getProjectTree() { return this.projectTree; }
  getProject(id: number) { return this.projects.get(id); }
  stateChanged = this.stateChanged$;
}

class MockActivatedRoute {
  snapshot = { paramMap: {
    get: (key: string) => 'mockValue'
  }};
  params = of({ id: 'mockId' })
};

describe('TabsProjectComponent', () => {
  let component: TabsProjectComponent;
  let fixture: ComponentFixture<TabsProjectComponent>;
  let mockService: MockUiStateService;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async () => {
    mockService = new MockUiStateService();
    mockActivatedRoute = new MockActivatedRoute();
    mockService.projects = new Map<number, Project>([[1, new Project(1, 'B Project', [])], [2, new Project(2, 'A Project', [])]]);
    mockService.projectTree = new Map<number, Map<number, number>>([[1, new Map()], [2, new Map()]]);
    await TestBed.configureTestingModule({
      imports: [
        ProjectItemComponent,
        NgForOf,
        CommonModule,
        RouterModule,
      ],
      providers: [
        { provide: UiStateService, useValue: mockService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TabsProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: sortProjects sorts by name', () => {
    component.sortProjects();
    expect(component.sortedProjects[0][0]).toBe(2); // 'A Project' first
    expect(component.sortedProjects[1][0]).toBe(1); // 'B Project' second
  });

  it('unit: should update on stateChanged$', () => {
    mockService.projects.set(3, new Project(3, 'C Project', []));
    mockService.projectTree.set(3, new Map());
    mockService.stateChanged$.next(mockService);
    component.sortProjects();
    expect(component.sortedProjects.length).toBe(3);
  });

  it('dom: should render project list', () => {
    component.sortProjects();
    fixture.detectChanges();
    const main = fixture.debugElement.query(By.css('main.container'));
    expect(main).toBeTruthy();
    const items = fixture.debugElement.queryAll(By.css('pui-project-item'));
    expect(items.length).toBe(2);
  });

  it('dom: should show no projects message if empty', () => {
    mockService.projectTree.clear();
    component.sortProjects();
    fixture.detectChanges();
    const noProjects = fixture.debugElement.query(By.css('main.no_projects'));
    expect(noProjects).toBeTruthy();
  });
});

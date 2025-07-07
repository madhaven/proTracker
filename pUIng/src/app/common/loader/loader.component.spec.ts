import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: should hide after percent is 100 and 2s pass', fakeAsync(() => {
    component.percent = 100;
    component.ngOnChanges();
    tick(2000);
    expect(component.visible).toBeFalse();
  }));

  it('dom: should render loader', () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    expect(div).toBeTruthy();
  });
});

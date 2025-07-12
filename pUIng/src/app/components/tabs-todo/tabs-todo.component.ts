import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { UiStateService } from '../../services/ui-state.service';
import { NewTaskData } from '../../models/new-task-data.model';
import { TaskStatus } from '../../common/task-status';
import { TaskLog } from '../../models/task-log.model';

@Component({
  selector: 'pui-tabs-todo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tabs-todo.component.html',
  styleUrl: './tabs-todo.component.css'
})
export class TabsTodoComponent {

  @ViewChild('task-list') private taskListElement?: ElementRef;
  @ViewChild('new-task') private newTaskInput?: ElementRef;
  private uiStateService: UiStateService;
  inputValue: string = '';
  todoList: Task[] = [];
  
  // TODO: add spinners/loaders to UI to show network operation

  constructor(
    uiStateService: UiStateService
  ) {
    this.uiStateService = uiStateService;
    this.uiStateService.stateChanged$.subscribe(newState => {
      this.uiStateService = newState;
      this.refreshTaskList();
    });
  }

  ngOnInit() {
    setTimeout(() => { this.refreshTaskList(); });
  }

  refreshTaskList() {
    var tasks = this.uiStateService.tasks;
    this.todoList = Array.from(tasks.values()).filter(
      task => task.projectId == -1 && this.uiStateService.getTaskStatus(task.id) != TaskStatus.COMPLETED
    );
  }
  
  addTask() {
    const summary = this.inputValue.trim();
    if (summary === '') return;

    var newTask = new NewTaskData(-1, new Date().getTime(), undefined, summary);
    this.uiStateService.newTask(newTask);
    this.inputValue = '';
  }
  
  handleCheckboxChange(event: Event, task: Task) {
    const target = event.target as HTMLInputElement;
    if (!target.checked) { return; }
    
    // TODO: create a return from stateservice type to track the change
    const listItem = target.parentNode as HTMLElement;
    listItem.style.opacity = '0';
    setTimeout(() => {
      listItem.remove();
      this.uiStateService.toggleTask(task.id, TaskStatus.COMPLETED, Date.now());
    }, 500);
  }
}

import { beforeEach, expect, test } from "vitest"
import { TasksState } from "@/common/types"
import { createTodolist, deleteTodolist } from "../todolist-slice"
import { updateTask, createTask, deleteTask, tasksReducer } from "../tasks-slice"
import { TaskPriority, TaskStatus } from "@/common/enum"
import { nanoid } from "@reduxjs/toolkit"
import { DomainTask } from "../../api/tasksApi.types"

const taskDefaultValues = {
  description: '',
  deadline: '',
  addedDate: '',
  startDate: '',
  priority: TaskPriority.Low,
  order: 0,
}
let startState: TasksState = {}

beforeEach(() => {  
  startState = {
    todolistId1: [
      { id: "1", title: "CSS", status: TaskStatus.New, todoListId: 'todolistId1', ...taskDefaultValues, entityStatus: 'idle' },
      { id: "2", title: "JS", status: TaskStatus.Completed, todoListId: 'todolistId1', ...taskDefaultValues, entityStatus: 'idle' },
      { id: "3", title: "React", status: TaskStatus.New, todoListId: 'todolistId1', ...taskDefaultValues, entityStatus: 'idle' },
    ],
    todolistId2: [
      { id: "1", title: "bread", status: TaskStatus.New, todoListId: 'todolistId2', ...taskDefaultValues, entityStatus: 'idle' },
      { id: "2", title: "milk", status: TaskStatus.Completed, todoListId: 'todolistId2', ...taskDefaultValues, entityStatus: 'idle' },
      { id: "3", title: "tea", status: TaskStatus.New, todoListId: 'todolistId2', ...taskDefaultValues, entityStatus: 'idle' },
    ],
  }
})

test("correct task should be deleted from correct array", () => {
  const taskIdToRemove = "2"
  const action = deleteTask.fulfilled({
    todolistId: "todolistId2",
    taskId: taskIdToRemove,
  }, 'requestId', { todolistId: "todolistId2", taskId: taskIdToRemove })

  const endState = tasksReducer(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      { id: "1", title: "CSS", status: TaskStatus.New, todoListId: 'todolistId1', ...taskDefaultValues, entityStatus: 'idle' },
      { id: "2", title: "JS", status: TaskStatus.Completed, todoListId: 'todolistId1', ...taskDefaultValues, entityStatus: 'idle' },
      { id: "3", title: "React", status: TaskStatus.New, todoListId: 'todolistId1', ...taskDefaultValues , entityStatus: 'idle'},
    ],
    todolistId2: [
      { id: "1", title: "bread", status: TaskStatus.New, todoListId: 'todolistId2', ...taskDefaultValues, entityStatus: 'idle' },
      { id: "3", title: "tea", status: TaskStatus.New, todoListId: 'todolistId2', ...taskDefaultValues, entityStatus: 'idle' },
    ],
  })
})

test("array should be created for new todolist", () => {
  const newTodolist = {
    id: nanoid(),
    title: "New todolist",
    filter: "all", 
    addedDate: "",
    order: 0,
  };
  
  const action = createTodolist.fulfilled({todolist: newTodolist}, 'requestId', newTodolist.title)
  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState) // ["todolistId1", "todolistId2", "newKey"]
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(startState, deleteTodolist.fulfilled({ id: 'todolistId2' }, 'requestId', 'todolistId2'))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})

test("проверка, что значения не равны ожидаемому", () => {
  // ✅ Тест пройден
  expect(5).not.toBe(10) // 5 не равно 10
  expect("hello").not.toContain("world") // строка 'hello' не содержит 'world'
})

test("correct task should be created at correct array", () => {
  const newTask = {
    id: nanoid(),
    title: "juice",
    status: TaskStatus.New,
    todoListId: "todolistId2",
    description: '',
    deadline: '',
    addedDate: '',
    startDate: '',
    priority: TaskPriority.Low,
    order: 0,
  };
  const endState = tasksReducer(
    startState,
    createTask.fulfilled({task: newTask}, 'requestId', { title: "juice", todolistId: "todolistId2" }),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its title", () => {
  const updatedTask: DomainTask = {
    id: "2",
    title: "yo",
    description: "Some description",
    status: TaskStatus.New,
    priority: TaskPriority.Low,
    startDate: "",
    deadline: "",
    todoListId: "todolistId2",
    order: 0,
    addedDate: new Date().toISOString(),
  };

  const action = updateTask.fulfilled(
    { task: updatedTask }, // Первый аргумент - объект с полем task
    '', // requestId (можно оставить пустым для теста)
    updatedTask, // Второй аргумент - аргумент, переданный в thunk
    '' // requestStatus (можно оставить пустым для теста)
  );

  const endState = tasksReducer(startState, action);

  expect(endState.todolistId2[0].title).toBe("bread");
  expect(endState.todolistId1[0].title).toBe("CSS");
  expect(endState.todolistId2[1].title).toBe("yo");
  expect(endState.todolistId2[1].id).toBe("2");
});

test("correct task should change its status", () => {
  const updatedTask: DomainTask = {
    id: "2",
    title: "yo",
    description: "Some description",
    status: TaskStatus.Completed,
    priority: TaskPriority.Low,
    startDate: "",
    deadline: "",
    todoListId: "todolistId2",
    order: 0,
    addedDate: new Date().toISOString(),
  };

  const action = updateTask.fulfilled(
    { task: updatedTask }, // Первый аргумент - объект с полем task
    'requestId', // requestId (можно оставить любое значение)
    updatedTask // Передаем сам task как аргумент
  );

  const endState = tasksReducer(startState, action);

  expect(endState.todolistId2[1].status).toBe(TaskStatus.Completed);
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed);
  expect(endState.todolistId2[2].status).toBe(TaskStatus.New);
});
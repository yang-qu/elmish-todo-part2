import { Union, Record } from "./fable_modules/fable-library.4.9.0/Types.js";
import { union_type, list_type, record_type, bool_type, string_type, int32_type } from "./fable_modules/fable-library.4.9.0/Reflection.js";
import { map, filter, singleton, append, maxBy, isEmpty, ofArray } from "./fable_modules/fable-library.4.9.0/List.js";
import { equals, createObj, comparePrimitives } from "./fable_modules/fable-library.4.9.0/Util.js";
import { createElement } from "react";
import { join } from "./fable_modules/fable-library.4.9.0/String.js";
import { Interop_reactApi } from "./fable_modules/Feliz.2.7.0/Interop.fs.js";
import { map as map_1, empty, singleton as singleton_1, append as append_1, delay, toList } from "./fable_modules/fable-library.4.9.0/Seq.js";
import { ProgramModule_mkSimple, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.0.0/program.fs.js";
import { Program_withReactSynchronous } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export class Todo extends Record {
    constructor(Id, Description, Completed) {
        super();
        this.Id = (Id | 0);
        this.Description = Description;
        this.Completed = Completed;
    }
}

export function Todo_$reflection() {
    return record_type("App.Todo", [], Todo, () => [["Id", int32_type], ["Description", string_type], ["Completed", bool_type]]);
}

export class State extends Record {
    constructor(TodoList, NewTodo) {
        super();
        this.TodoList = TodoList;
        this.NewTodo = NewTodo;
    }
}

export function State_$reflection() {
    return record_type("App.State", [], State, () => [["TodoList", list_type(Todo_$reflection())], ["NewTodo", string_type]]);
}

export class Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["SetNewTodo", "AddNewTodo", "DeleteTodo", "ToggleCompleted"];
    }
}

export function Msg_$reflection() {
    return union_type("App.Msg", [], Msg, () => [[["Item", string_type]], [], [["Item", int32_type]], [["Item", int32_type]]]);
}

export function init() {
    return new State(ofArray([new Todo(1, "Learn F#", true), new Todo(2, "Learn Elmish", false)]), "");
}

export function update(msg, state) {
    switch (msg.tag) {
        case 1:
            if (state.NewTodo === "") {
                return state;
            }
            else {
                let nextTodoId;
                const matchValue = state.TodoList;
                if (isEmpty(matchValue)) {
                    nextTodoId = 1;
                }
                else {
                    const elems = matchValue;
                    nextTodoId = (maxBy((todo) => todo.Id, elems, {
                        Compare: comparePrimitives,
                    }).Id + 1);
                }
                const nextTodo = new Todo(nextTodoId, state.NewTodo, false);
                return new State(append(state.TodoList, singleton(nextTodo)), "");
            }
        case 2: {
            const todoId = msg.fields[0] | 0;
            const nextTodoList = filter((todo_2) => (todo_2.Id !== todoId), state.TodoList);
            return new State(nextTodoList, state.NewTodo);
        }
        case 3: {
            const todoId_1 = msg.fields[0] | 0;
            const nextTodoList_1 = map((todo_3) => {
                if (todo_3.Id === todoId_1) {
                    return new Todo(todo_3.Id, todo_3.Description, !todo_3.Completed);
                }
                else {
                    return todo_3;
                }
            }, state.TodoList);
            return new State(nextTodoList_1, state.NewTodo);
        }
        default: {
            const desc = msg.fields[0];
            return new State(state.TodoList, desc);
        }
    }
}

export function div(classes, children) {
    return createElement("div", {
        className: join(" ", classes),
        children: Interop_reactApi.Children.toArray(Array.from(children)),
    });
}

export const appTitle = createElement("p", {
    className: "title",
    children: "Elmish To-Do List",
});

export function inputField(state, dispatch) {
    let value_1, elems;
    return div(ofArray(["field", "has-addons"]), ofArray([div(ofArray(["control", "is-expanded"]), singleton(createElement("input", createObj(ofArray([["className", join(" ", ["input", "is-medium"])], (value_1 = state.NewTodo, ["ref", (e) => {
        if (!(e == null) && !equals(e.value, value_1)) {
            e.value = value_1;
        }
    }]), ["onChange", (ev) => {
        dispatch(new Msg(0, [ev.target.value]));
    }]]))))), div(singleton("control"), singleton(createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-primary", "is-medium"])], ["onClick", (_arg) => {
        dispatch(new Msg(1, []));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-plus"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])))))]));
}

export function renderTodo(todo, dispatch) {
    let elems, elems_1;
    return div(singleton("box"), singleton(div(ofArray(["columns", "is-mobile", "is-vcentered"]), ofArray([div(singleton("column"), singleton(createElement("p", {
        className: "subtitle",
        children: todo.Description,
    }))), div(ofArray(["column", "is-narrow"]), singleton(div(singleton("buttons"), ofArray([createElement("button", createObj(ofArray([["className", join(" ", toList(delay(() => append_1(singleton_1("button"), delay(() => (todo.Completed ? singleton_1("is-success") : empty()))))))], ["onClick", (_arg) => {
        dispatch(new Msg(3, [todo.Id]));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-check"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])]))), createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-danger"])], ["onClick", (_arg_1) => {
        dispatch(new Msg(2, [todo.Id]));
    }], (elems_1 = [createElement("i", {
        className: join(" ", ["fa", "fa-times"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems_1))])])))]))))]))));
}

export function todoList(state, dispatch) {
    let elems;
    return createElement("ul", createObj(singleton((elems = toList(delay(() => map_1((todo) => renderTodo(todo, dispatch), state.TodoList))), ["children", Interop_reactApi.Children.toArray(Array.from(elems))]))));
}

export function render(state, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["style", {
        padding: 20,
    }], (elems = [appTitle, inputField(state, dispatch), todoList(state, dispatch)], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])));
}

ProgramModule_run(Program_withReactSynchronous("elmish-app", ProgramModule_mkSimple(init, update, render)));

//# sourceMappingURL=App.js.map

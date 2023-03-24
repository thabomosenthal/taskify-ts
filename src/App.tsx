import { Dispatch, FC, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { FaCheck, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import './App.css';
import { ITodo } from './models/todo';

const App: FC = () => {
	const [todo, setTodo] = useState<string>('');
	const [todoList, setTodoList] = useState<ITodo[]>([]);

	// debugging;
	useEffect(() => {
		console.log(todoList);
	}, [todoList]);

	const handleAddTask = (e: FormEvent) => {
		e.preventDefault();

		if (todo.trim() === '') return;
		const newTodo: ITodo = {
			id: new Date().getTime(),
			title: todo,
			completed: false,
		};
		setTodoList([...todoList, newTodo]);
		setTodo('');
	};

	return (
		<>
			<main className="flex flex-col items-center w-full gap-4 ">
				<h1 className="text-3xl font-bold z-10">Taskify</h1>
				<CInputField todo={todo} setTodo={setTodo} handleAdd={handleAddTask} />
				<CTodoList todoList={todoList} setTodoList={setTodoList} />
			</main>
		</>
	);
};

// InputField component
interface IInputFieldProps {
	todo: string;
	setTodo: Dispatch<SetStateAction<string>>;
	handleAdd: (e: FormEvent) => void;
}

const CInputField = ({ todo, setTodo, handleAdd }: IInputFieldProps) => {
	// const CInputField: FC<IInputFieldProps> = ({ todo, setTodo }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<form
				className="flex relative min-w-[15em] sm:min-w-[30em] items-center"
				onSubmit={(e) => {
					handleAdd(e);
					inputRef.current?.blur();
				}}
			>
				<input
					ref={inputRef}
					type="text"
					id="task"
					placeholder="Enter task"
					value={todo}
					onChange={(e) => setTodo(e.target.value)}
					className="px-3 h-14 text-sm w-full rounded-full delay-200 focus:outline-none shadow-inner focus:shadow-[0_0_10px_1000px_rgba(0,0,0,0.1)]"
				/>
				<button type="submit" className="rounded-full absolute right-2 aspect-square w-10 p-0 bg-slate-300 dark:bg-slate-700">
					add
				</button>
			</form>
		</>
	);
};

// TodoList component
interface ITodoListProps {
	todoList: ITodo[];
	setTodoList: Dispatch<SetStateAction<ITodo[]>>;
}

const CTodoList = ({ todoList, setTodoList }: ITodoListProps) => {
	return (
		<>
			{/* <h3>Todo List here...</h3> */}
			<div className="flex flex-col gap-0.5 py-3">
				{todoList.length === 0 ? <p>No tasks</p> : todoList.map((todo) => <CTodoItem key={todo.id} todo={todo} todoList={todoList} setTodoList={setTodoList} />)}
			</div>
		</>
	);
};

// TodoItem component
interface ITodoItemProps {
	todo: ITodo;
	todoList: ITodo[];
	setTodoList: Dispatch<SetStateAction<ITodo[]>>;
}

const CTodoItem = ({ todo, todoList, setTodoList }: ITodoItemProps) => {
	const editableTaskRef = useRef<any>({});
	const [isEditing, setIsEditing] = useState<boolean>(false);

	useEffect(() => {
		if (isEditing && !todo.completed) {
			editableTaskRef.current?.setAttribute('contenteditable', 'true');
			editableTaskRef.current?.focus();
		} else {
			editableTaskRef.current?.setAttribute('contenteditable', 'false');
			editableTaskRef.current?.blur();
		}
	}, [isEditing]);

	const handleEditTask = (todo: ITodo): void => {
		const editableText = editableTaskRef.current.innerText;

		setIsEditing(!isEditing);
		setTodoList(
			todoList.map((item) => {
				if (item.id === todo.id) return { ...item, title: editableText };
				return item;
			})
		);
	};

	const handleCompletedTask = (todo: ITodo): void => {
		setTodoList(
			todoList.map((item) => {
				if (item.id === todo.id) return { ...item, completed: !item.completed };
				return item;
			})
		);
	};

	const handleDeleteTask = (todo: ITodo): void => {
		setTodoList(todoList.filter((item) => item.id !== todo.id));
	};

	return (
		<>
			<p
				className={`flex items-center justify-between gap-1 w-52 sm:min-w-[25em] p-2 bg-slate-300 rounded-md ${
					todo.completed ? ' bg-green-500 dark:bg-green-700 border-b-4 border-green-900  dark:border-green-900 ' : ' dark:bg-slate-700 border-b-4 border-b-slate-500 dark:border-b-slate-800 '
				}`}
			>
				<span ref={editableTaskRef} className="flex-grow text-left w-min">
					{todo.title}
				</span>
				<button type="button" title="edit task" onClick={() => handleEditTask(todo)} className="p-0.5 border-none hover:text-gray-600 focus:outline-none focus:text-gray-400">
					<FaRegEdit />
				</button>
				<button type="button" title="mark task completed" onClick={() => handleCompletedTask(todo)} className="p-0.5 border-none hover:text-green-600 focus:outline-none focus:text-green-400">
					<FaCheck />
				</button>
				<button type="button" title="delete task" onClick={() => handleDeleteTask(todo)} className="p-0.5 border-none hover:text-red-600 focus:outline-none focus:text-red-400 ">
					<FaRegTrashAlt />
				</button>
			</p>
		</>
	);
};

export default App;

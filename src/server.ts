import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const users: Array<IUser> = [];

interface IUser {
  id: string;
  name: string;
  username: string;
  todo: Array<ITodo>;
}

interface ITodo {
  id: string;
  title: string;
  done: boolean;
  deadline: Date;
  created_at: Date;
}

function verifyIfExistUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { userid } = request.headers;

  const user = users.find((user) => user.id == userid);

  if (!user) {
    return response.status(400).json({ error: "Customer not found" });
  }

  // @ts-ignore
  request.user = user;

  return next();
}

app.post("/user", (request: Request, response: Response) => {
  const { name, username } = request.body;

  const user = {
    id: uuidv4(),
    name,
    username,
    todo: [],
  };

  users.push(user);

  return response
    .status(201)
    .json({ menssage: "Usuário criado com sucesso!", user });
});

app.get("/todo", verifyIfExistUser, (request, response) => {
  // @ts-ignore
  const { user } = request;
  const { todo } = user;

  return response.json({
    todo,
  });
});

app.post("/todo", verifyIfExistUser, (request, response) => {
  const { title, deadline } = request.body;

  // @ts-ignore
  const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todo.push(newTodo);

  return response.status(201).send();
});

app.listen(3333);

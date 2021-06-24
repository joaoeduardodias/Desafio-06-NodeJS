import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase


describe("Create Statement",()=>{
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository)
  })


it("should be able to create a new statement of type deposit", async()=>{
  const user = await usersRepository.create({
    name: "User test",
    email: "email@test.com.br",
    password: "123456"
  })
  const user_id = user.id as string;
  const statementOperation = await createStatementUseCase.execute({
    user_id,
    type: 'deposit' as OperationType,
    amount: 100,
    description: "Create statement"
  });
  expect(statementOperation).toHaveProperty("id")

})

it("should be able to create a new statement of type withdraw", async()=>{
  const user = await usersRepository.create({
    name: "User test",
    email: "email@test.com.br",
    password: "123456"
  })
  const user_id = user.id as string;
  await createStatementUseCase.execute({
    user_id,
    type: 'deposit' as OperationType,
    amount: 100,
    description: "Create statement"
  });
  const statementOperation = await createStatementUseCase.execute({
    user_id,
    type: 'withdraw' as OperationType,
    amount: 50,
    description: "Create statement"
  });

  expect(statementOperation).toHaveProperty("id")
})

    it("should not be able to create statement with nonexist user",()=>{

      expect(async()=>{
        await createStatementUseCase.execute({
          user_id: "123",
          amount: 50,
          description: "Testing errors",
          type: "deposit" as OperationType
        })
      }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)

    })

  it("should not be able to create a new statement of type withdraw with funds insufficient", ()=>{

      expect(async()=>{
        const user = await usersRepository.create({
          name: "User test",
          email: "email@test.com.br",
          password: "123456"
        })
        const user_id = user.id as string;
        await createStatementUseCase.execute({
          user_id,
          type: 'deposit' as OperationType,
          amount: 100,
          description: "Create statement"
        });
        await createStatementUseCase.execute({
          user_id,
          type: 'withdraw' as OperationType,
          amount: 150,
          description: "Create statement"
        });
      }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)


  })

})

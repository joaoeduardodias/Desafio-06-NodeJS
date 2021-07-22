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
    TRANSFER= 'transfers'
  }

  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository)
  })


it("should be able to create a new statement of type deposit", async()=>{
  const user = await usersRepository.create({
    name: "User test",
    email: "zuendin@porlupap.ci",
    password: "123456"
  })

  const statementOperation = await createStatementUseCase.execute({
    user_id: user.id as string,
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

  await createStatementUseCase.execute({
    user_id: user.id as string,
    type: 'deposit' as OperationType,
    amount: 100,
    description: "Create statement"
  });
  const statementOperation = await createStatementUseCase.execute({
    user_id: user.id as string,
    type: 'withdraw' as OperationType,
    amount: 50,
    description: "Create statement"
  });

  expect(statementOperation).toHaveProperty("id")
})

it("should be able to create a new statement of type transfer", async()=>{
  const user = await usersRepository.create({
    name: "User test",
    email: "email@test.com.br",
    password: "123456"
  })
  const recipient_user = await usersRepository.create({
    name: "User recipient test",
    email: "email@test2.com.br",
    password: "123456"
  })
  await createStatementUseCase.execute({
    amount: 500,
    description: "oceSkcLkCW",
    type: "deposit" as OperationType,
    user_id: user.id as string,
  })

  const statementOperation = await createStatementUseCase.execute({
    user_id: user.id as string,
    type: 'transfers' as OperationType,
    amount: 100,
    description: "Create statement",
    sender_id: user.id as string,
    recipient_id: recipient_user.id as string
  })


  expect(statementOperation).toHaveProperty("id")
})

it("should not be able to create statement with nonexist user", async()=>{

    await expect(createStatementUseCase.execute({
          user_id: "123",
          amount: 50,
          description: "Testing errors",
          type: "deposit" as OperationType
        })
    ).rejects.toEqual( new CreateStatementError.UserNotFound())

 })

it("should not be able to create a new statement of type withdraw with funds insufficient", async()=>{

  const user = await usersRepository.create({
    name: "User test",
    email: "email@test.com.br",
    password: "123456"
  })

  await createStatementUseCase.execute({
    user_id: user.id as string,
    type: 'deposit' as OperationType,
    amount: 100,
    description: "Create statement"
  });
  await expect(
       createStatementUseCase.execute({
          user_id: user.id as string,
          type: 'withdraw' as OperationType,
          amount: 150,
          description: "Create statement"
        })
      ).rejects.toEqual( new CreateStatementError.InsufficientFunds())


})

it("should not be able to create a new statement of type transfer with nonexistent recipient user", async()=>{


    const user = await usersRepository.create({
      name: "User test",
      email: "deco@civcaca.ee",
      password: "123456"
    })

    await expect(createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'transfers' as OperationType,
      amount: 150,
      description: "Create statement",
      recipient_id: "111"
    })
    ).rejects.toEqual(new CreateStatementError.UserNotFound())

})

it("should not be able to create a new statement of type transfer with funds insufficient", async()=>{

  const user = await usersRepository.create({
    name: "User test",
    email: "deco@civcaca.ee",
    password: "123456"
  })
  const recipient_user = await usersRepository.create({
    name: "Dorothy Perry",
    email: "mehabodi@wujwoznir.gu",
    password: "1212"
  })


  await expect(
    createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'transfers' as OperationType,
      amount: 150,
      description: "Create statement",
      recipient_id: recipient_user.id
    })
  ).rejects.toEqual(new CreateStatementError.InsufficientFunds())

  })

})

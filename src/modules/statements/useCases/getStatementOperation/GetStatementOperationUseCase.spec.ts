
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createStatementUseCase: CreateStatementUseCase

describe("Show Statement",()=>{

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER= 'transfers'
  }
  beforeEach(()=>{
    usersRepository  = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository,statementsRepository)
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
  })

  it("should be able show statement", async()=>{
      const user = await usersRepository.create({
        name: "User test",
        email: "email@test.com.br",
        password: "123456"
      })
     const statement = await createStatementUseCase.execute({
        amount: 100,
        description: "test statement",
        user_id: user.id as string,
        type: "deposit" as OperationType
      })
      const showStatement = await getStatementOperationUseCase.execute({
        statement_id: statement.id as string,
        user_id: user.id as string
      })
      expect(showStatement).toHaveProperty("id")
      expect(showStatement.description).toEqual('test statement')
  })

  it("should not be able show statement with nonexist user", async ()=>{
    expect(async()=>{

      await getStatementOperationUseCase.execute({
        user_id: "12",
        statement_id: "123456"
            })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("should not be able show nonexist statement", async ()=>{
    expect(async()=>{
      const user = await usersRepository.create({
        name: "User test",
        email: "email@test.com.br",
        password: "123456"
      })

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "123456"
            })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

})

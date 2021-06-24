import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase

describe("List Statements",()=>{

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase( statementsRepository,usersRepository)
  })

  it("should be able to list all statements of user",async()=>{

    const user = await usersRepository.create({
      name: "User Test",
      email: "email@test.com.br",
      password: "123456"
    })
    const user_id = user.id as string;
    await statementsRepository.create({
      user_id,
      type: 'withdraw' as OperationType,
      amount: 50,
      description: "Create statement"
    });
    await statementsRepository.create({
     user_id,
     type: 'deposit' as OperationType,
     amount: 100,
     description: "Create statement"
   });

   const balance = await getBalanceUseCase.execute({
     user_id,
   })

   expect(balance).toHaveProperty("balance")
   expect(balance.statement).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: 'withdraw' as OperationType,
        amount: 50,
        description: "Create statement"
      }),

    ])
  );


  })

  it("should not be able to list statements nonexistent user",()=>{

      expect(async()=>{

        await getBalanceUseCase.execute({
        user_id: "123"

      })

      }).rejects.toBeInstanceOf(GetBalanceError)

  })


})

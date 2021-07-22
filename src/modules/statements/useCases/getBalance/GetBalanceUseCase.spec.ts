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
    TRANSFER= 'transfers'
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
    const user_recipient = await usersRepository.create({
      name: "Norman Weber",
      email: "jofeva@ruhgaziji.se",
      password: '123456'
    })
    await statementsRepository.create({
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 400,
      description: "Create statement deposit"
    });

    await statementsRepository.create({
      user_id: user.id as string,
      type: 'withdraw' as OperationType,
      amount: 50,
      description: "Create statement withdraw"
    });

   await statementsRepository.create({
    user_id: user.id as string,
    recipient_id: user_recipient.id,
    sender_id: user.id as string,
    type: 'transfers' as OperationType,
    amount: 100,
    description: "Create statement transfer"
  });

   const balance = await getBalanceUseCase.execute({
    user_id: user.id as string
   })


   expect(balance).toHaveProperty("balance")



  })

  it("should not be able to list statements nonexistent user",async()=>{

     await expect( getBalanceUseCase.execute({
        user_id: "123"
      })

      ).rejects.toEqual(new GetBalanceError())

  })


})

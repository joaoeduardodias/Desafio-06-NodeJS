import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create a new User",()=>{

  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })


  it("should be able to create a new user", async()=>{

   const user = await createUserUseCase.execute({
      name: "User test",
      email: "user@test.com.br",
      password: "123456"
    })
    expect(user).toHaveProperty("id")
  })

  it("should not be able to create a new user with same email exists", ()=>{
   expect(async()=>{
    await createUserUseCase.execute({
      name: "User test",
      email: "user@test.com.br",
      password: "123456"
    })
    await createUserUseCase.execute({
      name: "User test",
      email: "user@test.com.br",
      password: "123456"
    })
   }).rejects.toBeInstanceOf(CreateUserError)

  })
})

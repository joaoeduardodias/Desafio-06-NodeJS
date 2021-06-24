import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase

describe("Authenticate user",()=>{

  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to authenticate user", async()=>{
   await createUserUseCase.execute({
      email: "email@test.com.br",
      name: "User test",
      password: "123456"
    })



      const response = await authenticateUserUseCase.execute({
        email: 'email@test.com.br',
        password: "123456"
      })
      expect(response).toHaveProperty("token")
  })

  it("should not be able to authenticate user with incorrect email", ()=>{

    expect(async()=>{
      await createUserUseCase.execute({
        email: "email@test.com.br",
        name: "User test",
        password: "123456"
      })
      await authenticateUserUseCase.execute({
        email: 'incorrect@email.com.br',
        password: "123456"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate user with incorrect password", ()=>{

    expect(async()=>{
      await createUserUseCase.execute({
        email: "email@test.com.br",
        name: "User test",
        password: "123456"
      })
      await authenticateUserUseCase.execute({
        email: 'email@test.com.br',
        password: "123"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})

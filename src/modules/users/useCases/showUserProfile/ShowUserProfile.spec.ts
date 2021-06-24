import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


  let usersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;


describe("Show user profile",()=>{

  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
  })

it("should be able show user profile", async()=>{
  const user = await usersRepository.create({

    name: "User test",
    email: "usertest@email.com.br",
    password: "123456"
  })
  const user_id = user.id as string
  const showUserProfile = await showUserProfileUseCase.execute(user_id)
  expect(showUserProfile).toHaveProperty("id")
  expect(showUserProfile.name).toEqual("User test")

})

it("should not be able show user profile nonexist user",()=>{
  expect(async()=>{
    await showUserProfileUseCase.execute("123ds")
  }).rejects.toBeInstanceOf(ShowUserProfileError)
})

})

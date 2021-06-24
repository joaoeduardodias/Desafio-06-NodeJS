import { hash } from 'bcryptjs'
import request from 'supertest'
import { Connection } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection: Connection

describe("Show Statement",()=>{

  beforeAll(async()=>{
    connection = await createConnection()
    await connection.runMigrations()
    const id = uuidV4();
    const password = await hash("123456", 8);
    await connection.query(
       `INSERT INTO users(id, name, email, password, created_at, updated_at)
        VALUES('${id}','test','email@test.com.br', '${password}', 'now()', 'now()')`
    );
  })

  afterAll(async()=>{
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to show statement", async()=>{
    const responseToken =  await request(app).post("/api/v1/sessions").send({
      email: 'email@test.com.br',
      password: '123456'
    })
    const { token } = responseToken.body

   const responseStatement = await request(app).post("/api/v1/statements/deposit").send({
        description: "Test deposit",
        amount: 100
      }).set({
        Authorization: `Bearer ${token}`
      })

      const { id: statement_id} = responseStatement.body

      const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
        Authorization: `Bearer ${token}`
      })

     expect(response.body).toHaveProperty("id")
     expect(response.status).toBe(200)
  })

})

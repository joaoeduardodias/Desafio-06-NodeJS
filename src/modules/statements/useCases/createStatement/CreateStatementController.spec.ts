import request from 'supertest'
import { hash } from 'bcryptjs'

import { v4 as uuidV4 } from 'uuid'
import {Connection} from 'typeorm'
import createConnection from '../../../../database'
import { app } from '../../../../app'


let connection: Connection


describe("Create Statement Controller",()=>{

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

  beforeEach(async()=>{
    await connection.query(`DELETE FROM statements`)
  })


  afterAll(async()=>{
    await connection.dropDatabase()
    await connection.close()
   })

  // it("should be able to create a new statement of type deposit",async()=>{

  //   const responseToken =  await request(app).post("/api/v1/sessions").send({
  //     email: 'email@test.com.br',
  //     password: '123456'
  //   })
  //   const { token } = responseToken.body

  //   const response =  await request(app).post("/api/v1/statements/deposit").send({
  //       description: "Test deposit",
  //       amount: 100
  //     }).set({
  //       Authorization: `Bearer ${token}`
  //     })

  //     expect(response.body).toHaveProperty("id")
  // })

  // it("should be able to create a new statement of type withdraw",async()=>{

  //   const responseToken =  await request(app).post("/api/v1/sessions").send({
  //     email: 'email@test.com.br',
  //     password: '123456'
  //   })
  //   const { token } = responseToken.body

  //   await request(app).post("/api/v1/statements/deposit").send({
  //     description: "Test deposit",
  //     amount: 150
  //   }).set({
  //     Authorization: `Bearer ${token}`
  //   })

  //   const response =  await request(app).post("/api/v1/statements/withdraw").send({
  //       description: "Test withdraw",
  //       amount: 100
  //     }).set({
  //       Authorization: `Bearer ${token}`
  //     })

  //     expect(response.body).toHaveProperty("id")
  // })
  it("should be able to create a new statement of type transfer", async()=>{
    const responseToken =  await request(app).post("/api/v1/sessions").send({
      email: 'email@test.com.br',
      password: '123456'
    })
    const { token } = responseToken.body

    const response =  await request(app).post(`/api/v1/statements/transfers/12121212`).send({
        description: "Test transfer",
        amount: 100
      }).set({
        Authorization: `Bearer ${token}`
      })

      // expect(response.body).toHaveProperty("id")
  })

  // it("should not be able to create a new withdrawal statement greater than the current amount ",async()=>{

  //   const responseToken =  await request(app).post("/api/v1/sessions").send({
  //     email: 'email@test.com.br',
  //     password: '123456'
  //   })
  //   const { token } = responseToken.body

  //   await request(app).post("/api/v1/statements/deposit").send({
  //     description: "Test deposit",
  //     amount: 50
  //   }).set({
  //     Authorization: `Bearer ${token}`
  //   })

  //   const response =  await request(app).post("/api/v1/statements/withdraw").send({
  //       description: "Test withdraw",
  //       amount: 200
  //     }).set({
  //       Authorization: `Bearer ${token}`
  //     })
  //     expect(response.body.message).toEqual('Insufficient funds')

  // })



  // it("should not be able to create a new statement with missing token",async()=>{

  //   const response =  await request(app).post("/api/v1/statements/deposit").send({
  //       description: "Test deposit",
  //       amount: 100
  //     })
  //     expect(response.body.message).toEqual('JWT token is missing!')
  // })



})

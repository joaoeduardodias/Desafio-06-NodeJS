import request from "supertest";
import {v4 as uuidV4} from 'uuid'

import { Connection } from "typeorm";
import createConnection from '../../../../database'
import { hash } from "bcryptjs";
import { app } from "../../../../app";

let connection: Connection

describe("List all Statements of User",()=>{
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }
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

  it("should be able to list all operations of user",async()=>{
    const responseToken =  await request(app).post("/api/v1/sessions").send({
      email: 'email@test.com.br',
      password: '123456'
    })
    const { token } = responseToken.body

    await request(app).post("/api/v1/statements/deposit").send({
      description: "Test deposit",
      amount: 100
    }).set({
      Authorization: `Bearer ${token}`
    })


    const response =  await request(app).get("/api/v1/statements/balance").set({
        Authorization: `Bearer ${token}`
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("balance")
      expect(response.body.statement).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'deposit' as OperationType,
            amount: 100,
            description: "Test deposit"
          }),

        ])
      );
  })

  it("should not be able to list all operations nonexist user", async()=>{

    const response =  await request(app).get("/api/v1/statements/balance")
    expect(response.body.message).toEqual("JWT token is missing!")

  })


})

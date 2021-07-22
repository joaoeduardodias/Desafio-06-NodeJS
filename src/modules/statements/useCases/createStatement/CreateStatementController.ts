import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER= 'transfers'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { user_id: recipient_id } = request.params
    let type: OperationType


    const splittedPath = request.originalUrl.split('/')
    if(splittedPath[splittedPath.length -2] === 'transfers'){
      type = splittedPath[splittedPath.length -2] as OperationType
    }
    else {
      type = splittedPath[splittedPath.length - 1] as OperationType;

    }

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      recipient_id
    });

    return response.status(201).json(statement);
  }
}

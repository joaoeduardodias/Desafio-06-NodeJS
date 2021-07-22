import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description, recipient_id }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }


    if(type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });
      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }
    if(type === 'transfers'){

      const recipient_user = await this.usersRepository.findById(recipient_id as string)

      if(!recipient_user) {
        throw new CreateStatementError.UserNotFound();
      }

      const { balance } = await this.statementsRepository.getUserBalance({user_id});

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }

      }

     const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id: user_id,
      recipient_id
    });

    return statementOperation;
  }
}

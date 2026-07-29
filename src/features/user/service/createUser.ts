import { CreateUserInput } from "../types/schemaUser";
import createUser from "../data/create";

async function createUserService(data: CreateUserInput) {
  try {
    await createUser(data);
  } catch (error) {
    console.log(error);
  }
}

export default createUserService;

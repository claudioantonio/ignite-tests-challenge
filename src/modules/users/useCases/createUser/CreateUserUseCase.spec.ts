import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    })

    it("should create a new user", async () => {
        await createUserUseCase.execute({
            name: "Cláudio",
            email: "claudio@rocketseat.com",
            password: "rocketseatignite",
        });
        let userCreated = await userRepositoryInMemory.findByEmail("claudio@rocketseat.com");
        expect(userCreated).toHaveProperty("id");
    });

    it("should throw an error if user already exists", async () => {
        await expect(async () => {
            await createUserUseCase.execute({
                name: "Cláudio",
                email: "claudio@rocketseat.com",
                password: "rocketseatignite",
            });

            await createUserUseCase.execute({
                name: "Cláudio",
                email: "claudio@rocketseat.com",
                password: "rocketseatignite",
            });
        }).rejects.toBeInstanceOf(AppError);

    });
});
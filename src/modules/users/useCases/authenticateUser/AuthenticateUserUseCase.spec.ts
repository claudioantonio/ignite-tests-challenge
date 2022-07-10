import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    })

    it("should authenticate a valid user", async () => {
        await createUserUseCase.execute({
            name: "Cláudio",
            email: "claudio@rocketseat.com",
            password: "rocketseatignite",
        });

        let authentication = await authenticateUserUseCase.execute({
            email: "claudio@rocketseat.com",
            password: "rocketseatignite",
        });

        expect(authentication).toHaveProperty("token");
    });

    it("should throw an error if the email is wrong", async () => {
        await expect(async () => {
            await createUserUseCase.execute({
                name: "Cláudio",
                email: "claudio@rocketseat.com",
                password: "rocketseatignite",
            });

            let authentication = await authenticateUserUseCase.execute({
                email: "claudio@anothercompany.com",
                password: "rocketseatignite",
            });
        }).rejects.toBeInstanceOf(AppError);

    });

    it("should throw an error if the password is wrong", async () => {
        await expect(async () => {
            await createUserUseCase.execute({
                name: "Cláudio",
                email: "claudio@rocketseat.com",
                password: "rocketseatignite",
            });

            let authentication = await authenticateUserUseCase.execute({
                email: "claudio@rocketseat.com",
                password: "rocketseatexplorer",
            });
        }).rejects.toBeInstanceOf(AppError);

    });
});
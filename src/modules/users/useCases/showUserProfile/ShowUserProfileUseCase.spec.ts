import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Show user profile", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
    })

    it("should show user profile for an existing user", async () => {
        let newUser = {
            name: "Cláudio",
            email: "claudio@rocketseat.com",
            password: "rocketseatignite",
        };
        await createUserUseCase.execute(newUser);
        let userCreated = await userRepositoryInMemory.findByEmail("claudio@rocketseat.com");
        let idUserCreated: string = userCreated?.id!;

        let userProfile = await showUserProfileUseCase.execute(idUserCreated);

        expect(newUser.name == userProfile.name).toEqual(true);
        expect(newUser.email == userProfile.email).toEqual(true);
    });

    it("should throw an error if user does not exist", async () => {
        expect(async () => {
            let unexistentId = "999";
            await showUserProfileUseCase.execute(unexistentId);
        }).rejects.toBeInstanceOf(AppError);
    });

});
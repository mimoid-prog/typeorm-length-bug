import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { Pet } from "./entity/Pet";

(async () => {
  await createConnection({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "typeorm-length-bug",
    entities: ["./src/entity/*.ts"],
    synchronize: true
  });

  const userRepo = getRepository(User);
  const petRepo = getRepository(Pet);

  const users = await userRepo.find();

  if (users.length === 0) {
    await userRepo.insert([
      {
        name: "Tommy"
      },
      {
        name: "Patrick"
      },
      {
        name: "Jack"
      }
    ]);

    await petRepo.insert([
      {
        type: "Dog",
        user: { id: "1" }
      },
      {
        type: "Cat",
        user: { id: "2" }
      },
      {
        type: "Pig",
        user: { id: "2" }
      }
    ]);
  }

  //1. orderBy LENGTH (works)
  const users1 = await userRepo
    .createQueryBuilder("u")
    .orderBy("LENGTH(u.name)", "DESC")
    .getMany();

  console.log("users1: ", users1);

  //2. orderBy LENGTH with take (works)
  const users2 = await userRepo
    .createQueryBuilder("u")
    .orderBy("LENGTH(u.name)", "DESC")
    .take(2)
    .getMany();

  console.log("users2: ", users2);

  //3. orderBy LENGTH with leftJoin (works)
  const users3 = await userRepo
    .createQueryBuilder("u")
    .leftJoinAndSelect("u.pets", "p")
    .orderBy("LENGTH(u.name)", "DESC")
    .getMany();

  console.log("users3: ", users3);

  //4. orderBy LENGTH with leftJoin and take (DOESN'T WORK!!!!)
  const users4 = await userRepo
    .createQueryBuilder("u")
    .leftJoinAndSelect("u.pets", "p")
    .orderBy("LENGTH(u.name)", "DESC")
    .take(2)
    .getMany();

  console.log("users4: ", users4);
})();

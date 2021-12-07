import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // this is what Promise.resolve is doing.
    // const arr = await fakeUsersService.find();

    // will create fake DI container
    // providers --- list of things we want to register in out testing DI container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          // is someone is asking for UsersService give them the value of fakeUsersService instead of real UsersService
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdasd@gmail.com', 'asdasd');
    expect(user.password).not.toEqual('asdasd');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws and error if user signs up with email that is in user', async () => {
    // new version of fakeUsersService
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await service.signup('asdasd@gmail.com', 'asdasd');

    try {
      await service.signup('asdasd@gmail.com', 'asdf');
      // done();
    } catch (error) {
      // done(error);
      Promise.resolve(error);
    }
  });

  it('throws if signin is called with and unused email', async () => {
    try {
      await service.signin('adasd@gmail.com', 'asdasd');
    } catch (err) {
      // console.log(err);

      Promise.resolve();
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdasd@gmail.com', 'password12');

    try {
      await service.signin('asdasd@gmail.com', 'password');
    } catch (error) {
      // console.log(error);
      Promise.resolve();
    }
  });

  it('return a user if correct password is provided', async () => {
    // const user = await service.signup('asdasd@gmail.com', 'mypassword');
    // console.log(user); helps to find out users hashed password

    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'asdasd@gmail.com',
    //       password:
    //         'e8f2ae66d7a8bbdb.712d5423d37d8a96e7b110e43cf2edf0b03e9199e8ac831f23794b1d78bfdf13',
    //     } as User,
    //   ]);

    await service.signup('asdasd@gmail.com', 'mypassword');

    const user = await service.signin('asdasd@gmail.com', 'mypassword');

    expect(user).toBeDefined();
  });
});

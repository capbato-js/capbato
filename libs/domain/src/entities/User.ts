import { AggregateRoot } from './Entity';
import { Email } from '../value-objects/Email';
import { Username } from '../value-objects/Username';
import { HashedPassword } from '../value-objects/HashedPassword';
import { Name } from '../value-objects/Name';
import { Role } from '../value-objects/Role';
import { UserRegisteredEvent } from '../events/UserEvents';

export interface UserProps {
  firstName: Name;
  lastName: Name;
  email: Email;
  username: Username;
  hashedPassword: HashedPassword;
  role: Role;
  createdAt: Date;
}

export class User extends AggregateRoot<string> {
  private readonly _firstName: Name;
  private readonly _lastName: Name;
  private readonly _email: Email;
  private readonly _username: Username;
  private readonly _hashedPassword: HashedPassword;
  private readonly _role: Role;
  private readonly _createdAt: Date;

  constructor(id: string, props: UserProps) {
    super(id);
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._username = props.username;
    this._hashedPassword = props.hashedPassword;
    this._role = props.role;
    this._createdAt = props.createdAt;

    // Add domain event when user is created
    this.addDomainEvent(new UserRegisteredEvent(id, props.email.value, props.username.value));
  }

  get firstName(): Name {
    return this._firstName;
  }

  get lastName(): Name {
    return this._lastName;
  }

  get email(): Email {
    return this._email;
  }

  get username(): Username {
    return this._username;
  }

  get hashedPassword(): HashedPassword {
    return this._hashedPassword;
  }

  get role(): Role {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get fullName(): string {
    return `${this._firstName.value} ${this._lastName.value}`;
  }

  public static create(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    hashedPassword: string,
    role: string
  ): User {
    return new User(id, {
      firstName: Name.create(firstName),
      lastName: Name.create(lastName),
      email: Email.create(email),
      username: Username.create(username),
      hashedPassword: HashedPassword.create(hashedPassword),
      role: Role.create(role),
      createdAt: new Date(),
    });
  }

  public toPlainObject() {
    return {
      id: this.id,
      firstName: this._firstName.value,
      lastName: this._lastName.value,
      email: this._email.value,
      username: this._username.value,
      hashedPassword: this._hashedPassword.value,
      role: this._role.value,
      createdAt: this._createdAt,
    };
  }
}
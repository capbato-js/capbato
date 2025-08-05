// Base Entity class for all domain entities
export abstract class Entity<TId> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  public get id(): TId {
    return this._id;
  }

  public equals(other: Entity<TId>): boolean {
    if (!(other instanceof Entity)) {
      return false;
    }

    return this._id === other._id;
  }

  /**
   * Helper method for validating business rules during entity creation
   * Use this in static create() methods to separate creation validation from reconstruction
   */
  protected static validateForCreation(validations: () => void): void {
    validations();
  }

  /**
   * Helper method to validate that an entity is being created (not reconstructed)
   * Returns true if this is a new entity creation, false if reconstruction
   */
  protected static isCreation(id?: any): boolean {
    return !id;
  }
}

// Base class for domain entities with events
export abstract class AggregateRoot<TId> extends Entity<TId> {
  private _domainEvents: DomainEvent[] = [];

  public get domainEvents(): ReadonlyArray<DomainEvent> {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}

// Base Domain Event
export abstract class DomainEvent {
  public readonly occurredOn: Date;

  constructor() {
    this.occurredOn = new Date();
  }
}

export class User {
  constructor({
    id = null,
    name = '',
    email = '',
    phone = '',
    status = 'active',
    created = Date.now()
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.created = created;
  }

  static fromJson(json) {
    return new User(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      status: this.status,
      created: this.created
    };
  }

  get formattedCreatedDate() {
    return new Date(this.created).toLocaleDateString();
  }
}

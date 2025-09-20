export class Payment {
  constructor({
    id = null,
    userId = '',
    user = '',
    amount = 0,
    status = 'pending',
    date = Date.now(),
    description = '',
    category = 'general',
    transactionId = '',
    method = 'card'
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.user = user;
    this.amount = amount;
    this.status = status;
    this.date = date;
    this.description = description;
    this.category = category;
    this.transactionId = transactionId;
    this.method = method;
  }

  static fromJson(json) {
    return new Payment(json);
  }

  toJson() {
    return {
      id: this.id,
      userId: this.userId,
      user: this.user,
      amount: this.amount,
      status: this.status,
      date: this.date,
      description: this.description,
      category: this.category,
      transactionId: this.transactionId,
      method: this.method
    };
  }

  get formattedAmount() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.amount);
  }

  get formattedDate() {
    return new Date(this.date).toLocaleDateString();
  }

  get statusColor() {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[this.status] || 'text-gray-600 bg-gray-100';
  }
}

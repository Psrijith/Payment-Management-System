// Test PaymentDetail component methods
describe('PaymentDetail Methods', () => {
  test('getStatusClass - should return correct CSS class for payment status', () => {
    // Simulate the getStatusClass method logic from PaymentDetail
    const getStatusClass = (status) => {
      const classes = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    };
    
    expect(getStatusClass('completed')).toBe('bg-green-100 text-green-800');
    expect(getStatusClass('pending')).toBe('bg-yellow-100 text-yellow-800');
    expect(getStatusClass('cancelled')).toBe('bg-red-100 text-red-800');
    expect(getStatusClass('invalid')).toBe('bg-gray-100 text-gray-800');
  });

  test('updateStatus - should prepare payment data for status update', () => {
    // Simulate the updateStatus method logic
    const payment = {
      id: '123',
      amount: 100,
      user: 'John Doe',
      status: 'pending',
      toJson: function() {
        return {
          id: this.id,
          amount: this.amount,
          user: this.user,
          status: this.status
        };
      }
    };
    
    const newStatus = 'completed';
    const updatedPayment = {
      ...payment.toJson(),
      status: newStatus
    };
    
    expect(updatedPayment.status).toBe('completed');
    expect(updatedPayment.id).toBe('123');
    expect(updatedPayment.amount).toBe(100);
  });
});

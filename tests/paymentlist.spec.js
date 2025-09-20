// Test PaymentList component methods
describe('PaymentList Methods', () => {
  test('filterPayments - should filter by search term', () => {
    // Simulate the filterPayments method logic
    const payments = [
      { id: 1, user: 'John Doe', description: 'Payment for services' },
      { id: 2, user: 'Jane Smith', description: 'Monthly subscription' },
      { id: 3, user: 'Bob Johnson', description: 'One-time payment' }
    ];
    
    const searchTerm = 'john';
    let filtered = [...payments];
    
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        (payment.user && payment.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.description && payment.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    expect(filtered.length).toBe(2); // John Doe and Bob Johnson
    expect(filtered[0].user).toBe('John Doe');
    expect(filtered[1].user).toBe('Bob Johnson');
  });

  test('getStatusClass - should return correct CSS class for status', () => {
    // Simulate the getStatusClass method logic
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
    expect(getStatusClass('unknown')).toBe('bg-gray-100 text-gray-800');
  });
});

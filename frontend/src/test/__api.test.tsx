import axios from 'axios';
describe('JSONPlaceholder Mock API', () => {
  it('GET API', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    expect(response.status).toBe(200);
  });
});

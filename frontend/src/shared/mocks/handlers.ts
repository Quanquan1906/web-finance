import { http, HttpResponse } from 'msw';

export const handlers = [
  // GET single user
  http.get('https://api.example.com/user', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
      email: 'john@example.com'
    });
  }),

  // GET users list
  http.get('https://api.example.com/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ]);
  }),

  // GET user by ID
  http.get('https://api.example.com/users/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id: Number(id),
      name: `User ${id}`,
      email: `user${id}@example.com`
    });
  }),

  // DELETE user
  http.delete('https://api.example.com/users/:id', ({ params }) => {
    return HttpResponse.json({ message: `User ${params.id} deleted` }, { status: 200 });
  })
];

const axios = require('axios');

describe('Integration Test', () => {
  beforeEach(async () => {
    // start server
    await require('../../src');
    jest.setTimeout(30000);
  });

  test('call /healthy route', async () => {
    const { data } = await axios.get('http://localhost:8080/healthy');
    expect(data.status).toBe(true);
  });
});

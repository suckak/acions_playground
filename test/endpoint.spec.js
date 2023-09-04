const flow = require('./flow.json');

describe('Valida el archivo JSON del flow', () => {
  test('find Text File node', async () => {
    expect(flow.nodes.some((node) => node.data.label === 'LLM Chain')).toBe(
      true
    );
  });
});

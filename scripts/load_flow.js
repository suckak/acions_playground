const axios = require('axios');
const chatFlow = require('../test/flow.json');

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
const baseUrl = `http://localhost:${PORT}/api/v1`;
const openAIApiKey = process.env.OPENAI_APIKEY;

const createCredential = async (name, apiKey) => {
  const payload = {
    name,
    credentialName: 'openAIApi',
    plainDataObj: { openAIApiKey: apiKey },
  };
  const { data } = await axios.post(`${baseUrl}/credentials`, payload);
  return data.id;
};

const createFlow = async (name, credentialId) => {
  const nodes = chatFlow.nodes.map((node) => {
    if (node.data.type === 'ChatOpenAI') {
      node.data.credential = credentialId;
    }
    return node;
  });

  const chatFlowCredential = { ...chatFlow, nodes };

  const payload = {
    deployed: false,
    flowData: JSON.stringify(chatFlowCredential),
    isPublic: false,
    name,
  };

  const { data } = await axios.post(`${baseUrl}/chatflows`, payload);
  //console.log(data);
  return data.id;
};

const testEndpoint = async (endpoint) => {
  console.log(`${baseUrl}/prediction/${endpoint}`);
  const response = await axios
    .post(
      `${baseUrl}/prediction/${endpoint}`,
      JSON.stringify({
        question: 'jabon de coco',
        history: [],
        overrideConfig: {},
      })
    )
    .catch((err) => err);
  console.log(response);
  return response.status === 200;
};

const fullFlow = async (flowName) => {
  const credentialId = await createCredential(
    'credential script',
    openAIApiKey
  );
  const flowId = await createFlow(flowName, credentialId);
  return await testEndpoint(flowId);
};

// createCredential("script", "asdfkjhgsdfkhjagsdfkghjasdf");
// console.log(createFlow("scriptFlow"));

//testEndpoint("1a62ba3a-3636-45db-a8f8-6a4055ec6223");

fullFlow('completo').then(console.log).catch(console.log);

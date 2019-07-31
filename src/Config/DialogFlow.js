const default_agent = {
  projectId: process.env.DIALOGFLOW_PROJECT_ID,
  config: {
    credentials: {
      private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace(
        new RegExp("\\\\n", "g"),
        "\n"
      ),
      client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
  }
};

export default {
    default_agent
};

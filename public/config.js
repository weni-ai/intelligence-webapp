const runtimeVariables = (() => ({
  VITE_VERSION: '(packageDict.version)',
  VITE_API_BASE_URL: 'https://engine-ai.dev.cloud.weni.ai/',
  VITE_BOTHUB_NLP_BASE_URL: 'https://nlp-ai-development.weni.ai/',
  VITE_BOTHUB_WEBAPP_BASE_URL:
    'https://platform-frontend-ai.dev.cloud.weni.ai/',
  VITE_VERSION_ENABLED: 'true',
  VITE_BOTHUB_WEBAPP_USE_SENTRY: 'true',
  VITE_SUPPORTED_LANGUAGES:
    'en|de|es|pt|fr|it|nl|pt_br|id|mn|ar|bn|hi|ru|th|vi|kh|sw|ca|da|el|fa|fi|ga|he|hr|hu|ja|nb|pl|ro|si|sv|te|tr|tt|ur|zh|ha|ka|kk|sq|hy|az|be|bs|bg|cs|ky|mk|sr|uk|uz|ab|aa|af|ak|am|an|as|av|ae|ay|bm|ba|eu|bh|bi|br|my|ch|ce|ny|kw|cv|co|cr|dv|dz|eo|et|ee|fo|fj|ff|gl|gu|ht|hz|ho|ia|ie|ig|ik|io|is|iu|jv|kl|kn|kr|ks|km|ki|rw|kv|kg|ko|ku|kj|la|lb|lg|li|ln|lo|lt|lu|lv|gv|mg|ms|ml|mt|mi|mr|mh|na|nv|nd|ne|ng|nn|no|ii|nr|oc|oj|cu|om|or|os|pa|pi|ps|qu|rm|rn|sa|sc|sd|se|sm|sg|gd|sn|sk|sl|so|st|su|ss|ta|tg|ti|bo|tk|tl|tn|to|tw|ty|ug|ve|vo|wa|cy|wo|fy|xh|yi|yo|za|zu',
  VITE_BOTHUB_WEBAPP_USE_HOTJAR: 'true',
  VITE_BOTHUB_WEBAPP_LIGHTHOUSE_KEY: 'y9lqt5qogvwy1fjqglux',
  VITE_BOTHUB_WEBAPP_LIGHTHOUSE_ALGORITHM_ARTICLE_ID: '9q5m2ju7nz',
  VITE_BOTHUB_WEBAPP_PAYMENT_ENABLED: 'false',
  VITE_BOTHUB_WEBAPP_TUTORIAL_ENABLED: 'true',
  VITE_BOTHUB_WEBAPP_HOTJAR_ID: '1842164',
  VITE_MAILCHIMP_LOGIN: 'bothub',
  VITE_BOTHUB_WEBAPP_SENTRY:
    'https://8dae8fecc49e4cb79c0bef5fa5f34b91@sentry.ilhasoft.mobi/23',
  VITE_MAILCHIMP_DATACENTER: 'us18',
  VITE_MAILCHIMP_USER_ID: '503b048b0ed01db127e66d354',
  VITE_MAILCHIMP_LIST_ID: '0fee24ee69',
  VITE_RECAPTCHA_TOKEN: '6LdeeLoaAAAAAK0dh1vWgcr4VMj9i1R7AsERnSaT',
  VITE_HELPHERO_ID: 'm7dO0to4OK',
  VITE_HELPHERO_TOUR: 'ZlUBE8O2Ik',
  VITE_QA_FLOW_CHANNEL: '4c46585b-8393-415b-856a-280c7d9ca9af',
  VITE_LOGROCKET_ID: 'weni/develop',
  VITE_LOGROCKET_PARENT_DOMAIN: 'https://dash-develop.weni.ai/',
  VITE_OPTIONS_WENIGPT:
    '[{"name": "shark-1", "description": "router.tunings.fields.shark-1", "model": "shark-1"}]',
  SENTRY_ENVIRONMENT: 'staging',
  VITE_ORGS_CAN_CREATE_CONTENT_AI: '',
  get(name) {
    return this[name];
  },
}))();

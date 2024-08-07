import axios from 'axios';

export function HotjarIdentifyUser({ token }) {
  const keycloak = {
    server: runtimeVariables.get('KEYCLOAK_SERVER'),
    realm: runtimeVariables.get('KEYCLOAK_REALM'),
  };

  const isThereAMissingKeycloakSettingValue = Object.values(keycloak).some(
    (value) => !value,
  );

  if (isThereAMissingKeycloakSettingValue) {
    return;
  }

  axios
    .get(
      `https://${keycloak.server}/auth/realms/${keycloak.realm}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then(({ data: { email, name, locale } }) => {
      tryToIndentifyToHotjar();

      function tryToIndentifyToHotjar() {
        if (window.hj) {
          window.hj('identify', email, {
            email,
            name,
            locale,
          });
        } else {
          setTimeout(tryToIndentifyToHotjar, 5000);
        }
      }
    });
}

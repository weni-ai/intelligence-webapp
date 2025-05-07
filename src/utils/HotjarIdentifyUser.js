import axios from 'axios';
import env from './env';

export function HotjarIdentifyUser({ token }) {
  const keycloak = {
    server: env('KEYCLOAK_SERVER'),
    realm: env('KEYCLOAK_REALM'),
  };

  const isThereAMissingKeycloakSettingValue = Object.values(keycloak).some(
    (value) => !value || value === 'null',
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

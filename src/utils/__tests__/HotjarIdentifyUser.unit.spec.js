import { HotjarIdentifyUser } from '@/utils/HotjarIdentifyUser.js';
import axios from 'axios';

const getRequest = vi.spyOn(axios, 'get').mockResolvedValue({
  data: {
    email: 'user@email.com',
    name: 'FirstName SecondName',
    locale: 'en-US',
  },
});

describe('HotjarIdentifyUser.js', () => {
  describe.each([
    {
      server: null,
      realm: null,
    },
    {
      server: null,
      realm: 'realm-1',
    },
    {
      server: 'server-2',
      realm: null,
    },
  ])(
    'when keycloak server is $server and keycloak realm is $realm',
    ({ server, realm }) => {
      beforeEach(() => {
        vi.clearAllMocks();

        vi.stubEnv('VITE_KEYCLOAK_SERVER', server);
        vi.stubEnv('VITE_KEYCLOAK_REALM', realm);

        HotjarIdentifyUser({ token: '1234' });
      });

      it('should not call keycloak get user info', () => {
        expect(getRequest).not.toHaveBeenCalled();
      });
    },
  );

  describe('when keycloak settings is defined', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.useFakeTimers();

      vi.stubEnv('VITE_KEYCLOAK_SERVER', 'server-2');
      vi.stubEnv('VITE_KEYCLOAK_REALM', 'realm-2');

      HotjarIdentifyUser({ token: 'Bearer 1234' });
    });

    it('calls keycloak get user info', () => {
      expect(getRequest).toHaveBeenCalledWith(
        'https://server-2/auth/realms/realm-2/protocol/openid-connect/userinfo',
        {
          headers: {
            Authorization: 'Bearer 1234',
          },
        },
      );
    });

    it('identifies the user to the Hotjar', () => {
      global.hj = vi.fn();

      vi.runAllTimers();

      expect(global.hj).toHaveBeenCalledWith('identify', 'user@email.com', {
        email: 'user@email.com',
        locale: 'en-US',
        name: 'FirstName SecondName',
      });
    });
  });
});

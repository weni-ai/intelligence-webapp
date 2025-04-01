export function getJwtToken() {
  return new Promise((resolve) => {
    const isInIframe = window.self !== window.top;

    if (!isInIframe) resolve();

    console.log('getJwtToken');

    const eventHandler = (event) => {
      if (event.data.event === 'updateToken') {
        console.log('updateToken');
        localStorage.setItem('authToken', `Bearer ${event.data.token}`);
        window.removeEventListener('message', eventHandler);
        return resolve();
      }
    };
    window.addEventListener('message', eventHandler);
    console.log('postMessage');

    window.parent.postMessage({ event: 'getToken' }, '*');
  });
}

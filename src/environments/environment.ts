// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyA9jS4GsF06aoxOUR7PxOOoZHMQnNsrgY0",
    authDomain: "streamlabs-cdf6e.firebaseapp.com",
    databaseURL: "https://streamlabs-cdf6e.firebaseio.com",
    projectId: "streamlabs-cdf6e",
    storageBucket: "",
    messagingSenderId: "629481692980"
  },
  youtubeConfig: {
    apiKey: 'N-Uzf3XHLbxwFjZfDANcCbhJ',
    clientId: '629481692980-fjno58pvud1u02kr23761qgfrgpu7dh3.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl'
  }
};

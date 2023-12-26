import { PluginOption, defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import { serveTestFixtures } from '../../vite.config';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  server: { host: true, https: true, port: 10086 },
  base: './',
  plugins: [
    basicSsl(),
    react({
      jsxRuntime: 'classic',
    }),
    serveTestFixtures,
    rtcMessaging(), 
    clickMessaging()
  ],
  define: {
    // References:
    // - https://github.com/smnhgn/vite-plugin-package-version/blob/master/src/index.ts#L10
    // - https://stackoverflow.com/a/70524430
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        stream: "stream.html",
        desktop: 'webXR.html'
      },
    },
  },
});

// Custom message passing plugin
function rtcMessaging() {
  return {
    name: "rtc",
    configureServer(server) {
      function forwardMessage(event) {
        server.ws.on(event, (data, client) => {
          console.log("forwarding", event);
          server.ws.clients.forEach((c) => {
            if (c !== client) c.send(event, data);
          });
        });
      }
      forwardMessage("rtc:offer");
      forwardMessage("rtc:answer");
      forwardMessage("rtc:ice");
      forwardMessage("rtc:htmlconnect");
      forwardMessage("rtc:jsconnect");
    },
  };
}


function clickMessaging() {
  return {
    name: 'click',
    configureServer(server) {
      // should forward all events with click: prefix to all clients
      server.ws.on('click:event', (data, client) => {
        console.log('forwarding click');
        server.ws.clients.forEach(c => {
          if (c !== client) c.send('click:event', data);
        });
      });
    }
  }
}
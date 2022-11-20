interface WsConfig {
  port?: number;
  hostname?: string;
}

export interface ClientConfig {
  socket: WebSocket;
  addr: Deno.NetAddr;
}

export type WsHandler = (
  client: ClientConfig,
  e: MessageEvent<any>,
) => Promise<any>;

const clientSet = new Set<WebSocket>();

export const ws = async ({ port = 8080 }: WsConfig, callback: WsHandler) => {
  const listener = Deno.listen({
    port,
  });

  if (listener) {
    console.log(`The WebSocket Server run at ${port}`);
  }

  for await (const conn of listener) {
    handle(conn, callback);
  }
};

const handle = async (conn: Deno.Conn, callback: WsHandler) => {
  const httpConn = Deno.serveHttp(conn);

  const request = await httpConn.nextRequest();

  if (request) {
    const { socket, response } = Deno.upgradeWebSocket(request.request);

    socket.onopen = () => {
      clientSet.add(socket);
      // console.log(`The client ${(conn.remoteAddr as Deno.NetAddr).hostname} has been connected`);
    };

    socket.onerror = () => {
      clientSet.delete(socket);
      // console.error(`The client ${(conn.remoteAddr as Deno.NetAddr).hostname} connecte error and closed`);

      conn.close();
    };

    socket.onclose = () => {
      clientSet.delete(socket);
      // console.log(`The client ${(conn.remoteAddr as Deno.NetAddr).hostname} closed`);
    };

    socket.onmessage = (e) =>
      callback({
        socket,
        addr: conn.remoteAddr as Deno.NetAddr,
      }, e);

    request.respondWith(response);
  }
};

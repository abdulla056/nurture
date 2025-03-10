# How to setup:

For this project, you must setup two different .env files, `.env` and `.env.local`.

After running `npm run dev` and activating the `server.py` Python server, a Redis server must be activated. With Windows, WSL must be used, and `redis-server --port ___` must be run with the correct port. Without this server, the authentication will not work.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

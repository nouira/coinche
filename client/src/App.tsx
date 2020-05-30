import React from 'react';
import {Lobby, Client} from 'boardgame.io/react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {game as contreGame} from './shared/contre';
import {BoardComponent as contreBoard} from './contre/Client';
import 'antd/dist/antd.css';
import {SocketIO} from 'boardgame.io/multiplayer';

const App: React.FunctionComponent = () => {
  const PORT = process.env.BGIO_PORT || '8000';
  const server = `http://localhost:${PORT}`;
  // if (!process.env.REACT_APP_API_BASE_URL) {
  //   throw new Error('REACT_APP_API_BASE_URL env var must be set');
  // }

  return (
    <Router>
      <Switch>
        <Route path="/">
          <Lobby
            gameServer={server}
            lobbyServer={server}
            gameComponents={[
              { game: contreGame, board: contreBoard },
            ]}
          />
        </Route>
      </Switch>
    </Router>
  );
};
// const App = Client({ game: coincheGame, board: coincheBoard, numPlayers: 4 });
// const App = Client({ game: contreGame, board: contreBoard, numPlayers: 4 });

// const ContreClient = Client({
//   game: contreGame,
//   board: contreBoard,
//   multiplayer: SocketIO({ server: 'http://localhost:8000/' })
// });
//
// const App =  () => (
//   <div>
//     <ContreClient playerID="0" />
//     <ContreClient playerID="1" />
//     <ContreClient playerID="2" />
//     <ContreClient playerID="3" />
//   </div>
// );
export default App;

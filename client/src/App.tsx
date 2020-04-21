import React from 'react';
import {Lobby, Client} from 'boardgame.io/react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {game as coincheGame} from './shared/coinche';
import {BoardComponent as coincheBoard} from './coinche/Client';
import {game as contreGame} from './shared/contre';
import {BoardComponent as contreBoard} from './contre/Client';
import 'antd/dist/antd.css';

// const App: React.FunctionComponent = () => {
//   if (!process.env.REACT_APP_API_BASE_URL) {
//     throw new Error('REACT_APP_API_BASE_URL env var must be set');
//   }

//   return (
//     <Router>
//       <Switch>
//         <Route path="/">
//           <Lobby
//             gameServer={process.env.REACT_APP_API_BASE_URL}
//             lobbyServer={process.env.REACT_APP_API_BASE_URL}
//             gameComponents={[
//               { game: coincheGame, board: coincheBoard },
//               { game: contreGame, board: contreBoard },
//             ]}
//           />
//         </Route>
//       </Switch>
//     </Router>
//   );
// };
// const App = Client({ game: coincheGame, board: coincheBoard, numPlayers: 4 });
const App = Client({ game: contreGame, board: contreBoard, numPlayers: 4 });

export default App;

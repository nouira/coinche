import React, { Fragment } from 'react';
import {CardColor, CardName, secretCard, Card, SecretCard} from '../../../shared/contre';
import {CardComponentProps, MiniCardComponentProps, SuitComponentProps} from './index';
import cards from './cards.svg';

const getPlayCardStateClass = (playCardState: CardComponentProps['playCardState']): string => {
  switch (playCardState) {
    case undefined:
      return '';
    case 'playable':
      return 'playable';
    case 'forbidden':
      return 'forbidden';
  }
};

export const SvgCardComponent: React.FunctionComponent<CardComponentProps> = ({
  card,
  playCardState,
  isTrump,
  onCardClick,
  onSayBelotClick,
  onDontSayBelotClick,
  style,
}) => {
  return (
    <div className={`cardWrapper ${getPlayCardStateClass(playCardState)}`} style={style}>
      <svg width="84" height="122" onClick={onCardClick}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" >
        {CardSuit(card, isTrump)}
        {playCardState === 'forbidden' && (
          <g transform="scale(0.5) translate(0,238)" opacity=".6" >
            {baseCard(335.14999, 972.54999, '#333')}
          </g>)}
      </svg>
      {onSayBelotClick && onDontSayBelotClick && (
        <React.Fragment>
          <span className="belotChooseButton say" onClick={onSayBelotClick} role="img" aria-label="say belot and play">🔈</span>
          <span className="belotChooseButton dontSay" onClick={onDontSayBelotClick} role="img" aria-label="play">🔇</span>
        </React.Fragment>
      )}
    </div>
  );
};

const baseCard = (
  x: number,
  y: number,
  fill: string | undefined,
) => {
  const style = {
    fill: fill ?? '#FFFFFF',
    stroke: '#000000',
    strokeWidth: 2.5,
  };
  return(
    <g id="base">
      <path style={style}
        d="M 0,0C0,3.78 3.09,6.87 6.87,6.87L159.715,6.87C163.485,6.87 166.575,3.78 166.575,0L166.575,-228.4C166.575,-232.18 163.485,-235.27 159.715,-235.27L6.87,-235.27C3.09,-235.27 0,-232.18 0,-228.4L0,0 z" />
    </g>
  );
};

const CardSuit = (card: Card | SecretCard, isTrump: boolean | undefined) => {
  let cardComponent;
  let styleRed={fill:'#e6180a'};
  let styleBlack={fill:'#000000'};
  let cardStyle = styleBlack;
  if (card === secretCard) {
    cardComponent = (
      <g id="alternate-back" transform="translate(-333.89999,-736.02999)" fill="#1890ff">
        {baseCard(335.14999, 972.54999, '#fff')}
        <use xlinkHref={`${cards}#rect3250`} />
        <use xlinkHref={`${cards}#rect3252`} />
        <use xlinkHref={`${cards}#rect3254`} />
        <use xlinkHref={`${cards}#rect3256`} />
      </g>
    );
  }
  else {
    let suit;
    switch (card.color) {
      case CardColor.Spade:
        suit = 'spade';
        cardStyle = styleBlack;
        break;
      case CardColor.Club:
        suit = 'club';
        cardStyle = styleBlack;
        break;
      case CardColor.Diamond:
        suit = 'diamond';
        cardStyle = styleRed;
        break;
      case CardColor.Heart:
        suit = 'heart';
        cardStyle = styleRed;
        break;
    }

    const cardBaseFill = isTrump ? '#ffdaba' : '#fff';

    const figureCard = (suit: string, rank: string, translate: string, matrixUp: string, matrixDown: string) =>
    {
      return (
        <g>
          <g transform="translate(-1674.5,236.52)">
            <use xlinkHref={`${cards}#${isTrump ? 'base_trump' : 'base'}`} x="1675.75" y="0" width="100%" height="100%" />
            <g style={{fill:'none', stroke:'#000000', strokeWidth:1}}>
              <path d="m 1685.25,-175.117 0,177.387" />
              <path d="m 1685.25,2.27 130.78,0" />
              <path d="m 1833.83,-54.03 0,-177.637" />
              <path d="m 1833.83,-231.667 -130.78,0" />
            </g>
            <g>
              <use xlinkHref={`${cards}#${suit}`} x="713.26398" y="-85.257301" transform="matrix(-2.4,0,0,-2.4,3423.6672,-409.23504)" width="100%" height="100%" />
              <rect x="1693.33" y="-223.601" width="9.6925697" height="37.967999" style={{fill:cardBaseFill}} />
            </g>
            <g>
              <use xlinkHref={`${cards}#${suit}`} x="753.01703" y="-10.2745" transform="scale(2.4,2.4)" width="100%" height="100%" />
              <rect x="1816.49" y="-43.642799" width="9.6925697" height="37.967999" style={{fill:cardBaseFill}} />
            </g>
            <g transform="matrix(0.99950656,-0.03141076,0.03141076,0.99950656,4.4710094,55.21189)">
              <line x1="1718.46" y1="-55.102501" x2="1800.61" y2="-174.295" style={{stroke:'#000000',strokeWidth:7.25}} />
              {lineCircle(1720.88,-58.1609)}
              {lineCircle(1724.26, -63.058701)}
              {lineCircle(1727.63, -67.956398)}
              {lineCircle(1731.01, -72.854103)}
              {lineCircle(1734.38, -77.7519)}
              {lineCircle(1737.76, -82.649597)}
              {lineCircle(1741.14, -87.547401)}
              {lineCircle(1744.51, -92.445099)}
              {lineCircle(1747.89, -97.342903)}
              {lineCircle(1751.26, -102.241)}
              {lineCircle(1754.64, -107.138)}
              {lineCircle(1758.01, -112.036)}
              {lineCircle(1761.39, -116.934)}
              {lineCircle(1764.76, -121.832)}
              {lineCircle(1768.14, -126.729)}
              {lineCircle(1771.52, -131.627)}
              {lineCircle(1774.89, -136.52499)}
              {lineCircle(1778.27, -141.423)}
              {lineCircle(1781.64, -146.32001)}
              {lineCircle(1785.02, -151.218)}
              {lineCircle(1788.39, -156.116)}
              {lineCircle(1791.77, -161.013)}
              {lineCircle(1795.14, -165.911)}
              {lineCircle(1798.52, -170.80901)}
            </g>
            <use xlinkHref={`${cards}#${rank}`} x="1684.78" y="-203.347" style={cardStyle} width="100%" height="100%" />
            <use xlinkHref={`${cards}#${rank}`} x="1834.3" y="-26.049999" style={cardStyle} transform="matrix(-1,0,0,-1,3668.6,-52.1)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1689.4" y="-185.117" transform="matrix(-1,0,0,-1,3378.8,-370.234)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1829.67" y="-44.279999" width="100%" height="100%" />
          </g>
          <g transform={translate}>
            <use xlinkHref={`${cards}#${rank}_${suit}`} transform={matrixUp} x="0" y="0" width="2178.4751" height="1215.6875" />
            <use xlinkHref={`${cards}#${rank}_${suit}`} transform={matrixDown} x="0" y="0" width="2178.4751" height="1215.6875" />
          </g>
        </g>
      );
    };

    const lineCircle = (x: number, y: number) => (
      <Fragment>
        <circle cx={x} cy={y} r="2.2" style={{fill:'#ffffff'}} />
        <circle cx={x} cy={y} r="0.69999999" style={{fill:'#000000'}} />
      </Fragment>);

    switch (card.name) {
      case CardName.Ace:
        cardComponent = (
          <g transform="translate(1.25,236.52)">
            <use xlinkHref={`${cards}#${isTrump ? 'base_trump' : 'base'}`} x="0" y="0" width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_1`} x="7" y="-199.117" style={cardStyle} width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_1`} x="166.575" y="-30.280001" style={cardStyle} transform="matrix(-1,0,0,-1,327.15,-60.56)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="13.65" y="-185.117" transform="matrix(-1,0,0,-1,27.3,-370.234)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="153.925" y="-44.279999" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="34.911499" y="-50.653599" transform="matrix(-2.4,0,0,-2.4,167.5752,-243.13728)" width="100%" height="100%" />
            {(card.color === CardColor.Club) &&
              <use xlinkHref={`${cards}#laurel`} transform="matrix(0.0875,0,0,0.0875,44.623,-159.8)" x="0" y="0" width="100%" height="100%" />
            }
          </g>
        );
        break;
      case CardName.Seven:
        cardComponent = (
          <g transform="translate(-1004.2,236.52)">
            <use xlinkHref={`${cards}#${isTrump ? 'base_trump' : 'base'}`} x="1005.45" y="0"width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_7`} x="1009.45" y="-199.117" style={cardStyle} width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_7`} x="1169.02" y="-30.280001" style={cardStyle} transform="matrix(-1,0,0,-1,2338.04,-60.56)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1019.1" y="-185.117" transform="matrix(-1,0,0,-1,2038.2,-370.234)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1159.37" y="-44.279999" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="437.21201" y="-82.712502" transform="matrix(-2.4,0,0,-2.4,2098.6176,-397.02)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="437.21201" y="-50.653599" transform="matrix(-2.4,0,0,-2.4,2098.6176,-243.13728)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="437.21201" y="-14.599" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="470.48599" y="-82.712502" transform="matrix(-2.4,0,0,-2.4,2258.3328,-397.02)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="470.48599" y="-50.653599" transform="matrix(-2.4,0,0,-2.4,2258.3328,-243.13728)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="470.48599" y="-14.599" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="453.849" y="-60.1474" transform="matrix(-2.4,0,0,-2.4,2178.4752,-288.70752)" width="100%" height="100%" />
          </g>
        );
        break;
      case CardName.Eight:
        cardComponent = (
          <g transform="translate(-1171.77,236.52)">
            <use xlinkHref={`${cards}#${isTrump ? 'base_trump' : 'base'}`} x="1173.02" y="0"width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_8`} x="1177.02" y="-199.117" style={cardStyle} width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_8`} x="1336.6" y="-30.280001" style={cardStyle} transform="matrix(-1,0,0,-1,2673.2,-60.56)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1186.67" y="-185.117" transform="matrix(-1,0,0,-1,2373.34,-370.234)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1326.95" y="-44.279999" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="507.035" y="-82.712502" transform="matrix(-2.4,0,0,-2.4,2433.768,-397.02)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="507.035" y="-60.1474" transform="matrix(-2.4,0,0,-2.4,2433.768,-288.70752)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="507.035" y="-37.164101" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="507.035" y="-14.599" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="540.30902" y="-82.712502" transform="matrix(-2.4,0,0,-2.4,2593.4832,-397.02)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="540.30902" y="-60.1474" transform="matrix(-2.4,0,0,-2.4,2593.4832,-288.70752)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="540.30902" y="-37.164101" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="540.30902" y="-14.599" transform="scale(2.4,2.4)" width="100%" height="100%" />
          </g>
        );
        break;
      case CardName.Nine:
        cardComponent = (
          <g transform="translate(-1339.35,236.52)">
            <use xlinkHref={`${cards}#${isTrump ? 'base_trump' : 'base'}`} x="1340.6" y="0"width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_9`} x="1344.6" y="-199.117" style={cardStyle} width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_9`} x="1504.17" y="-30.280001" style={cardStyle} transform="matrix(-1,0,0,-1,3008.34,-60.56)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1354.25" y="-185.117" transform="matrix(-1,0,0,-1,2708.5,-370.234)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1494.52" y="-44.279999" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="576.85797" y="-82.712502" transform="matrix(-2.4,0,0,-2.4,2768.9184,-397.02)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="576.85797" y="-60.1474" transform="matrix(-2.4,0,0,-2.4,2768.9184,-288.70752)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="576.85797" y="-37.164101" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="576.85797" y="-14.599" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="610.13202" y="-82.712502" transform="matrix(-2.4,0,0,-2.4,2928.6336,-397.02)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="610.13202" y="-60.1474" transform="matrix(-2.4,0,0,-2.4,2928.6336,-288.70752)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="610.13202" y="-37.164101" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="610.13202" y="-14.599" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="593.495" y="-71.429901" transform="matrix(-2.4,0,0,-2.4,2848.776,-342.86352)" width="100%" height="100%" />
          </g>
        );
        break;
      case CardName.Ten:
        cardComponent = (
          <g transform="translate(-1506.92,236.52)">
            <use xlinkHref={`${cards}#${isTrump ? 'base_trump' : 'base'}`} x="1508.17" y="0"width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_10`} x="1512.17" y="-199.117" style={cardStyle} width="100%" height="100%" />
            <use xlinkHref={`${cards}#n_10`} x="1671.75" y="-30.280001" style={cardStyle} transform="matrix(-1,0,0,-1,3343.5,-60.56)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1521.83" y="-185.117" transform="matrix(-1,0,0,-1,3043.66,-370.234)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="1662.1" y="-44.279999" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="646.68103" y="-82.712502" transform="matrix(-2.4,0,0,-2.4,3104.0688,-397.02)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="646.68103" y="-60.1474" transform="matrix(-2.4,0,0,-2.4,3104.0688,-288.70752)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="646.68103" y="-37.164101" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="646.68103" y="-14.599" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="679.95502" y="-82.712502" transform="matrix(-2.4,0,0,-2.4,3263.784,-397.02)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="679.95502" y="-60.1474" transform="matrix(-2.4,0,0,-2.4,3263.784,-288.70752)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="679.95502" y="-37.164101" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="679.95502" y="-14.599" transform="scale(2.4,2.4)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="663.31799" y="-71.429901" transform="matrix(-2.4,0,0,-2.4,3183.9264,-342.86352)" width="100%" height="100%" />
            <use xlinkHref={`${cards}#${suit}`} x="663.31799" y="-25.8815" transform="scale(2.4,2.4)" width="100%" height="100%" />
          </g>
        );
        break;
      case CardName.Jack:
        switch (card.color) {
          case CardColor.Club:
            cardComponent = figureCard(suit, 'jack',
              'translate(-1674.5,236.52)',
              'matrix(0.990001,0,0,0.99,1330.845,-204.5343)',
              'matrix(-0.989999,0,0,-0.99,2188.317,-24.84575)',
            );
            break;
          case CardColor.Spade:
            cardComponent = figureCard(suit, 'jack',
              'translate(-1674.5,-492.89199)',
              'matrix(0.99,0,0,0.99,1572.692,562.2044)',
              'matrix(-0.989999,0,0,-0.99,1946.599,666.6126)',
            );
            break;
          case CardColor.Diamond:
            cardComponent = figureCard(suit, 'jack',
              'translate(-1674.5,-6.616994)',
              'matrix(-0.989999,-0.00159189,0.00159189,-0.989999,1828.046,183.0043)',
              'matrix(0.989996,0.00285726,-0.00285726,0.989996,1691.285,73.6636)',
            );
            break;
          case CardColor.Heart:
            cardComponent = figureCard(suit, 'jack',
              'translate(-1674.5,-249.75499)',
              'matrix(0.99, 0.000204312, -0.000204312, 0.99, 1452, 302)',
              'matrix(-0.99,-2.043122e-4,2.043122e-4,-0.99,2067.342,441.4238)',
            );
            break;
        }
        break;
      case CardName.Queen:
        switch (card.color) {
          case CardColor.Club:
            cardComponent = figureCard(suit, 'queen',
              'translate(-1842.0699,236.52)',
              'matrix(0.99,0,0,0.99,1604.55,-403.0585)',
              'matrix(-0.99,0,0,-0.99,2249.595,173.7161)',
            );
            break;
          case CardColor.Spade:
            cardComponent = figureCard(suit, 'queen',
              'translate(-1842.0699,-492.89199)',
              'matrix(0.99,0,0,0.99,1734.085,343.6556)',
              'matrix(-0.99,0,0,-0.99,2120.139,887.7019)',
            );
            break;
          case CardColor.Diamond:
            cardComponent = figureCard(suit, 'queen',
              'translate(-1842.0699,-6.616994)',
              'matrix(0.99,0,0,0.99,1862.402,-132.8428)',
              'matrix(-0.99,0,0,-0.99,1991.998,389.6324)',
            );
            break;
          case CardColor.Heart:
            cardComponent = figureCard(suit, 'queen',
              'translate(-1842.0699,-249.75499)',
              'matrix(0.999999,0,0,1,1472.202,77.37381)',
              'matrix(-1,0,0,-1,2382.186,665.8032)',
            );
            break;
        }
        break;
      case CardName.King:
        switch (card.color) {
          case CardColor.Club:
            cardComponent = figureCard(suit, 'king',
              'translate(-2009.65,236.52)',
              'matrix(0.99,0,0,0.99,2058.172,-647.2718)',
              'matrix(-0.99,0,0,-0.99,2131.263,417.7458)',
            );
            break;
          case CardColor.Spade:
            cardComponent = figureCard(suit, 'king',
              'translate(-2009.65,-492.89199)',
              'matrix(0.990001,0,0,0.99,1919.606,75.16761)',
              'matrix(-0.989999,0,0,-0.99,2269.614,1154.51)',
            );
            break;
          case CardColor.Diamond:
            cardComponent = figureCard(suit, 'king',
              'translate(-2009.65,-6.616994)',
              'translate(1769.457,-416.0703)',
              'matrix(-1,0,0,-1,2419.875,672.9645)',
            );
            break;
          case CardColor.Heart:
            cardComponent = figureCard(suit, 'king',
              'translate(-2009.65,-249.75499)',
              'matrix(0.99,0,0,0.99,1638.359,-170.9284)',
              'matrix(-0.99,0,0,-0.99,2551.075,914.141)',
            );
            break;
        }
        break;
    }
  }

  return (
    <g transform="scale(0.5)">
      {cardComponent}
    </g>
  );
};
export const SvgSuitComponent: React.FunctionComponent<SuitComponentProps> =({
  cardColor,
  onSuitClick,
  size= 'normal',
}) => {
  let suit;
  switch (cardColor) {
    case CardColor.Spade:
      suit = 'spade';
      break;
    case CardColor.Club:
      suit = 'club';
      break;
    case CardColor.Diamond:
      suit = 'diamond';
      break;
    case CardColor.Heart:
      suit = 'heart';
      break;
  }
  let transform, width, height;
  switch (size) {
    case 'normal':
      transform = 'scale(1.25)';
      width = height = 20;
      break;
    case 'small':
      transform = 'scale(0.75)';
      width = height = 12;
      break;
    case 'big':
      transform = 'scale(1.5)';
      width = height = 30;
      break;

  }
  return (
    <svg width={height} height={width} onClick={onSuitClick}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink" >
      <use xlinkHref={`${cards}#suit-${suit}`} transform={transform} />
    </svg>
  );
};

export const SvgMiniCardComponent: React.FunctionComponent<MiniCardComponentProps> =({
  card,
  isTrump,
  isWinner,
  style,
}) => {

  let suit;
  let color;
  switch (card?.color) {
    case CardColor.Spade:
      suit = 'spade';
      color = 'black';
      break;
    case CardColor.Club:
      suit = 'club';
      color = 'black';
      break;
    case CardColor.Diamond:
      suit = 'diamond';
      color = 'red';
      break;
    case CardColor.Heart:
      suit = 'heart';
      color = 'red';
      break;
  }
  let name;
  switch (card.name) {
    case CardName.Ace:
      name = '1';
      break;
    case CardName.Seven:
      name = '7';
      break;
    case CardName.Eight:
      name = '8';
      break;
    case CardName.Nine:
      name = '9';
      break;
    case CardName.Ten:
      name = '10';
      break;
    case CardName.Jack:
      name = 'V';
      break;
    case CardName.Queen:
      name = 'D';
      break;
    case CardName.King:
      name = 'R';
      break;
  }
  return (
    <div className={`miniCard ${isTrump ?'trump':''} ${isWinner ?'winner':''}`}>
      <div className={`name ${color}`}>{name}</div>
      <svg width="20" height="20"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" >
        <use xlinkHref={`${cards}#suit-${suit}`} transform="scale(1.25)" />
      </svg>
    </div>
  );
};

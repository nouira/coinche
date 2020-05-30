import React, {useContext} from 'react';
import {I18nContext} from '../context/i18n';
import { Col, Button } from 'antd';

type ComponentProps = {
  isDisplayedPreviousCardsPlayed: boolean;
  toggleIsDisplayedPreviousCardsPlayed: () => void;
};
export const PreviousCardsPlayedMenuComponent: React.FunctionComponent<ComponentProps> = ({
  isDisplayedPreviousCardsPlayed,
  toggleIsDisplayedPreviousCardsPlayed,
}) => {
  const i18n = useContext(I18nContext);

  return (
    <Col offset={10} span={10}>
      <Button onClick={() => toggleIsDisplayedPreviousCardsPlayed()} data-testid="button toggleIsDisplayedPreviousCardsPlayed">{
        isDisplayedPreviousCardsPlayed ? i18n.PreviousCardsPlayedMenu.doNotDisplayPreviousCardsPlayed : i18n.PreviousCardsPlayedMenu.displayPreviousCardsPlayed
      }</Button>
    </Col>
  );
};

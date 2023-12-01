import {FC} from 'react';
import styled from 'styled-components';
import { Date } from '../../types/Period';

const StyledEventItem = styled.article`

  & h4 {
    margin-bottom: 13px;
    font-family: 'BebasNeue';
    font-size: clamp(16px, 2vw, 25px);
    line-height: 115%; 
    color: ${props => props.color ||props.theme.colors.accentBlue};
  }

  & p {
    font-size: clamp(14px, 1.7vw, 20px);
    font-weight: 400;
    line-height: 145%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }
`;

const EventItem: FC<Date> = ({ year, info }) => {

  return (
    <StyledEventItem> 
      <h4>{year}</h4>
      <p>{info}</p>
    </StyledEventItem>
  );
}

export default EventItem;
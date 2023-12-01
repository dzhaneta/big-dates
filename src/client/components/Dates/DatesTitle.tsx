import {FC} from 'react';
import styled from 'styled-components';
import gradientLine from '../../assets/icons/gradient-line.svg';

const Title = styled.div`

  @media ${props => props.theme.media.laptop} {
    position: absolute;
  }
  
  h2 {
    font-size: clamp(20px, 3.88vw, 56px);
    font-weight: 700;
    line-height: 120%;

    @media ${props => props.theme.media.laptop} {
      padding-left: clamp(35px, -0.884rem + 6.4vw, 78px);
      background-image: url(${gradientLine});
      background-size: 5px 100%;
      background-position: left;
      background-repeat: no-repeat;
      /* background: url(${gradientLine}) left/5px no-repeat; */
    }
  }
`;

const DatesTitle: FC = () => {
  
  return(
    <Title>
        <h2>Исторические<br/>
          даты
        </h2>
    </Title>
  );
};

export default DatesTitle;
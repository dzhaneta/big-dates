import { createGlobalStyle } from "styled-components";
import PTSansWoff from '../assets/fonts/PTSans-Regular.woff';
import PTSansWoff2 from '../assets/fonts/PTSans-Regular.woff2';
import PTSansBoldWoff from '../assets/fonts/pt-sans_bold.woff';
import PTSansBoldWoff2 from '../assets/fonts/pt-sans_bold.woff2';
import BebasNeueWoff from '../assets/fonts/BebasNeueRegular.woff';
import BebasNeueWoff2 from '../assets/fonts/BebasNeueRegular.woff2';

const FontStyles = createGlobalStyle`
  @font-face {
    font-family: 'PTSans';
    font-weight: 400;
    src: url(${PTSansWoff2}) format('woff2'),
        url(${PTSansWoff}) format('woff');
  }

  @font-face {
    font-family: 'PTSans';
    font-weight: 700;
    src: url(${PTSansBoldWoff2}) format('woff2'),
        url(${PTSansBoldWoff}) format('woff');
  }

  @font-face {
    font-family: 'BebasNeue';
    font-weight: 400;
    src: url(${BebasNeueWoff2}) format('woff2'),
        url(${BebasNeueWoff}) format('woff');
  }
`;

export default FontStyles;
import {FC, useRef} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styled from 'styled-components';
import { Pagination, Navigation } from 'swiper/modules';
import { gsap } from 'gsap';
import buttonPrev from '../../assets/icons/icon-button-prev.svg';
import buttonNext from '../../assets/icons/icon-button-next.svg';
import { addZero } from '../../utils/helpers';
import { Period } from '../../types/Period';
import PeriodCirleSwicth from './PeriodCirleSwitch';


const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-grow: 1;
  align-items: center;
  z-index: 2;
  position: static; // for pagination&nav positioning

  @media ${props => props.theme.media.laptop} {
    position: relative;
    padding: 0 clamp(35px, -0.884rem + 6.4vw, 78px) 0; 

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: ${props => props.theme.colors.bgLine};
      z-index: 0;
    }
  }

  & .swiper-wrapper {
    /* overflow: hidden; */
  }
`;

const NavPanel = styled.div`
  position: absolute;
  bottom: 13.33px;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 0.554rem + 0.36vw, 14px);

  @media ${props => props.theme.media.laptop} {
    bottom: 0;
  }

  & .period-swiper-fraction {
    color: ${props => props.color ||props.theme.colors.primary};
    font-size: 14px;
    font-weight: 400;
    line-height: 100%;
    white-space: nowrap;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: clamp(8px, 0.286rem + 1.07vw, 20px);

  & .swiper-nav-button {
    width: clamp(25px, 1.116rem + 2.23vw, 50px);
    aspect-ratio: 1;
    border: none;
    background-color: transparent;

    &:disabled {
      opacity: 0.5;
    }
  }

  & .swiper-button-prev-custom {
      background: url(${buttonPrev}) center/100% no-repeat;
    }

    & .swiper-button-next-custom {
      background: url(${buttonNext}) center/100% no-repeat;
    }
`;

const PeriodSlide = styled(SwiperSlide)`
  display: flex;
  justify-content: center;
  gap: 34px;

  h3 {
    font-family: 'PTSans';
    font-size: clamp(56px, 13.88vw, 200px);
    font-weight: 700;
    line-height: normal;
    letter-spacing: -1.12px;
    text-align: center;

    /* line-height: 160px; /* 80% */
    /* letter-spacing: -4px; */
  }

  h3:first-of-type {
    color: ${props => props.color ||props.theme.colors.accentBlue};
  }

  h3:last-of-type {
    color: ${props => props.color ||props.theme.colors.accentPink};
  }
`;

const Cirle = styled.div`
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 3;

  @media ${props => props.theme.media.laptop} {
    display: block;
  }
`;

type PeriodSliderProps = {
  periods: Period[];
  onChangePeriod: (newPeriod: number) => void;
};

const PeriodSlider: FC<PeriodSliderProps> = ({ periods, onChangePeriod }) => {
  console.log('period slider gets periods', periods);
  const swiperRef = useRef<any>(null);

  function handleChangePeriod() {
    const activeIndex = swiperRef.current && swiperRef.current.swiper.activeIndex + 1;
    const activeSlide = document.querySelector(`.swiper-slide:nth-child(${activeIndex})`);
    const startYear = activeSlide?.querySelector('h3:first-of-type');
    const endYear = activeSlide?.querySelector('h3:last-of-type');

    // period animation
    if (startYear instanceof Element && endYear instanceof Element) {

      gsap.from(startYear, {
        innerText: periods[swiperRef.current.swiper.previousIndex].start,
        duration: 0.5,
        snap : {
          innerText: 1
        }
      });

      gsap.from(endYear, {
        innerText: periods[swiperRef.current.swiper.previousIndex].end,
        duration: 0.5,
        snap : {
          innerText: 1
        }
      });

    }

    onChangePeriod(activeIndex);
  };
  
  return (
    <StyledSwiper
      ref={swiperRef}
      onSlideChange={() => handleChangePeriod()}
      modules={[Pagination, Navigation]}
      slidesPerView={1}
      className="period-swiper"
      navigation={{
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
      }}
      pagination={{
        type: 'fraction',
        el: '.period-swiper-fraction',
        formatFractionCurrent: addZero,
        formatFractionTotal: addZero,
      }}
    >
      
      {periods.map(period => (
        <PeriodSlide key={period.id}>
            <h3>{period.start}</h3>
            <h3>{period.end}</h3>
        </PeriodSlide>
      ))}
      
      <Cirle>
        <PeriodCirleSwicth periods={periods}/>
      </Cirle>
      <NavPanel>
        <span className='period-swiper-fraction'></span>
        <NavButtons>
          <button className="swiper-button-prev-custom swiper-nav-button"></button>
          <button className="swiper-button-next-custom swiper-nav-button"></button>
        </NavButtons>
      </NavPanel>
    </StyledSwiper>
  );
}

export default PeriodSlider;
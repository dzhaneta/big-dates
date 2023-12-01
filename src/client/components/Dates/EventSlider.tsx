import {FC, useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import styled from 'styled-components';
import { Pagination, Navigation } from 'swiper/modules';
import EventItem from './EventItem';
import { Date } from '../../types/Period';
import arrowNextBlue from '../../assets/icons/icon-arrow-next-blue.svg';
import arrowPrevBlue from '../../assets/icons/icon-arrow-prev-blue.svg';


const StyledSwiper = styled(Swiper)`
  padding-top: 20px;
  width: 100%;
  overflow: visible;
  border-top: 1px solid ${props => props.color ||props.theme.colors.mediumGrey};
  

  @media ${props => props.theme.media.laptop} {
    padding-top: 56px;
    padding-left: clamp(35px, -0.884rem + 6.4vw, 78px);
    padding-right: clamp(35px, -0.884rem + 6.4vw, 78px);
    border-top: none;
  }

  & .swiper-wrapper {
    position: static;
    height: 114px;
    padding-bottom: 127px;

    @media ${props => props.theme.media.laptop} {
      height: 135px;
      padding-bottom: 0;
      position: relative;
      
    }
  }

  & .swiper-slide {
    width: clamp(200px, 10.357rem + 10.71vw, 320px);
  }

  & .swiper-pagination {
    bottom: 27.33px;
    height: 8px;
    z-index: 1;

    @media ${props => props.theme.media.laptop} {
      display: none;
    }

    & .swiper-pagination-bullet {
      margin: 0 5px;
      width: 6px;
      height: 6px;
      background-color: ${props => props.color ||props.theme.colors.primary};
      opacity: 0.4;

      &-active {
        opacity: 1;
      }
    }
  }
`;

const EventsNavButton = styled.button`

  &.events-button {
    width: 32px;
    height: 32px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0px 0px 15px ${props => props.theme.colors.shadow};
    display: none;
    z-index: 1;
    
    &:disabled {
      display: none;
    }

    @media ${props => props.theme.media.laptop} {
      display: block;
      position: absolute;
      top: 50%;
      background-position: center; 
      background-repeat:no-repeat;
      background-size: 5px 10px;
      border: none;
    }
  }
  
  &.events-button-prev {
    left: 0;
    background-image: url(${arrowPrevBlue});
    

    @media ${props => props.theme.media.desktop} {
      left: 20px;
    }
  }

  &.events-button-next {
    right: 0;
    background-image: url(${arrowNextBlue});


    @media ${props => props.theme.media.desktop} {
      right: 20px;
    }
  }
`;


const EventSlider: FC<{ events: Date[]; }> = ({ events }) => {

  const [swiper, setSwiper] = useState<any>(null);
  const slideTo = (index: number) => swiper && swiper.slideTo(index);

  // setting first slide after period change
  useEffect(() => {
    slideTo(0);
  }, [events]);

  return (
    <StyledSwiper
      onSwiper={setSwiper}
      className="mySwiper"
      modules={[Pagination, Navigation]}
      pagination={{
        clickable: true,
      }}
      navigation={{
        nextEl: '.events-button-next',
        prevEl: '.events-button-prev',
      }}
      spaceBetween={25}
      slidesPerView={'auto'}
      watchSlidesProgress={'true'}
      breakpoints={{
        480: {
          spaceBetween: 25,
        },
        768: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 80,
      },
      }}
    >
      <EventsNavButton className='events-button events-button-prev'></EventsNavButton>
      {events.map(item => (
        <SwiperSlide key={item.year}>
          <EventItem year={item.year} info={item.info}/>
        </SwiperSlide>
      ))}
      <EventsNavButton className='events-button events-button-next'></EventsNavButton>
    </StyledSwiper>
  );
}

export default EventSlider;
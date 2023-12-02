import {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import { Content } from '../../styles/content';
import { getPeriods } from '../../api';
import { Period, Date } from '../../types/Period';
import PeriodSlider from './PeriodSlider';
import EventSlider from './EventSlider';
import DatesTitle from './DatesTitle';

const DatesWrapper = styled.section`
  position: relative;
  background-color: ${props => props.color ||props.theme.colors.lightGrey};
  overflow: hidden;

  @media ${props => props.theme.media.laptop} {
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      width: 1px;
      height: 100%;
      background-color: ${props => props.theme.colors.bgLine};
      z-index: 0;
    }
  }
`;

const DatesContent = styled(Content)`
  min-height: clamp(568px, 26.357rem + 45.71vw, 1080px);
  padding: 58px 20px 13.33px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative; // for pagination&nav positioning

  @media ${props => props.theme.media.tablet} {
    padding: 30px 10px 30px;
  }

  @media ${props => props.theme.media.laptop} {
    padding: 50px 10px 50px;
    border-left: 1px solid;
    border-right: 1px solid;
    border-color: ${props => props.theme.colors.bgLine};
  }

  @media ${props => props.theme.media.desktop} {
    padding: 170px 0 104px;
  }
`;

const Dates: FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [activePeriod, setActivePeriod] = useState<number>(1);
  const [events, setEvents] = useState<Date[]>([]);

  // FETCH DATA
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const fetchedPeriods = await getPeriods();
        setPeriods(fetchedPeriods);
        setEvents(fetchedPeriods[activePeriod - 1].dates);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDates();
  }, []);

  useEffect(() => {
    if (periods.length === 0) {
      return;
    }

    const currDates = periods[activePeriod - 1].dates;  
    setEvents(currDates);
  }, [activePeriod]);

  // HANDLERS

  function changePeriod (newPeriod: number) {
    console.log('new period', newPeriod);    
    setActivePeriod(newPeriod);
  }
  
  return (
    <DatesWrapper>
      <DatesContent>
        <DatesTitle />

        <PeriodSlider periods={periods} activeIndex={activePeriod - 1} onChangePeriod={changePeriod}/>

        <EventSlider events={events}/>
      </DatesContent>
    </DatesWrapper>
  );
}

export default Dates;
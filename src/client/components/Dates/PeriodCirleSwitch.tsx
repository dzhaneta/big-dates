import {FC, useRef, useState, useLayoutEffect} from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Period } from '../../types/Period';
import dot from '../../assets/icons/icon-dot.svg'

const PeriodWheel = styled.div`
  width: clamp(350px, 19.732rem + 14.88vw, 530px);

  .item {
    position: relative;
    width: 56px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: url(${dot}) center/6px no-repeat;
    z-index: 1;
    font-size: 0;

    transition-property: background, text-align, font-size, font-weight, line-height;
    transition-duration: 0.3s;
    transition-timing-function: linear;
    transition-delay: 0;

    &:hover {
      cursor: pointer;
    }

    &:hover:not(.active) {
      width: 56px;
      background: none ${props => props.theme.colors.lightGrey};
      border: 1px solid rgba(48, 62, 88, 0.5);
      text-align: center;
      font-size: 20px;
      font-weight: 400;
      line-height: 56px;
    }

    span {
      position: absolute;
      top: 13px;
      left: 76px;
      display: none;
      font-size: 20px;
      font-weight: 700;
      line-height: 150%;
    }

    &.active {
      width: 56px;
      background: none ${props => props.theme.colors.lightGrey};
      border: 1px solid rgba(48, 62, 88, 0.5);
      text-align: center;
      font-size: 20px;
      font-weight: 400;
      line-height: 56px;

      span {
        display: block;
      }
    }
  }

  svg {
    width: 350px;
    aspect-ratio: 1;
    opacity: 0.2;
    overflow: visible;
    z-index: -1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    
    @media ${props => props.theme.media.desktop} {
      width: 410px;
    }

    @media ${props => props.theme.media.largeScreens} {
      width: 530px;
    }
  }

  .st0 { fill: none;
      stroke: ${props => props.theme.colors.primary};
      stroke-width: 1;
      stroke-miterlimit:1;
  }
`;

type PeriodCirleSwicthProps = {
  periods: Period[];
  activeIndex: number;
  onSwitchPeriod: (activeIndex: number) => void;
}

const PeriodCirleSwicth: FC<PeriodCirleSwicthProps> = ({ periods, activeIndex, onSwitchPeriod }) => {

  const [itemsEls, setItemsEls] = useState<HTMLElement[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  
  gsap.registerPlugin(MotionPathPlugin);

  const trackerRef = useRef<{ item: number }>({ item: 0 });
  const snapRef = useRef<(value: number) => number>();
  const wrapProgressRef = useRef<(value: number) => number>();

  let numItems: number;
  let itemStep: number;
  let tl: gsap.core.Timeline;
  let wrapTracker: (value: number) => number;

  tl = gsap.timeline({ paused: true, reversed: true });


  useLayoutEffect(() => {

    const circlePath = MotionPathPlugin.convertToPath("#holder", false)[0];
    circlePath.id = "circlePath";
    svgRef.current?.prepend(circlePath);

    const items = gsap.utils.toArray('.item') as HTMLElement[];
    setItemsEls(items);

    numItems = items.length;
    itemStep = 1 / numItems;
    wrapProgressRef.current = gsap.utils.wrap(0, 1);
    snapRef.current = gsap.utils.snap(itemStep);
    wrapTracker = gsap.utils.wrap(0, numItems);
    
    if (items.length > 0) {
      items.forEach((item, i) => {
        gsap.set(item, {
          motionPath: {
            path: circlePath,
            align: circlePath,
            alignOrigin: [0.5, 0.5],
            end: gsap.utils.wrap(0, 1, i / items.length - 0.15),
          },
          scale: 0.9,
        });
      });
    }
    
    tl.to('.wrapper', {
      rotation: 360, 
      transformOrigin: 'center', 
      duration: 1, 
      ease: 'none'
    });

    tl.to(items, {
      rotation: "-=360", 
      transformOrigin: 'center center', 
      duration: 1, 
      ease: 'none',
    }, 0);

    tl.to(trackerRef, {
      item: numItems,
      duration: 1, 
      ease: 'none',
      modifiers: {
        item: value => wrapTracker(numItems - Math.round(value))
      }
    }, 0);
  }, [periods]);

  const handleClick = (i: number) => {
    const current = trackerRef.current.item;
    const activeItem = i;

    if (i === current) {
      return;
    }

    // set active item to the item that was clicked and remove active class from all items
    const newItems: HTMLElement[] = [...itemsEls];

    newItems[current].classList.remove('active');
    newItems[activeItem].classList.add('active');
    setItemsEls(newItems);
    trackerRef.current.item = activeItem;

    const diff = current - i;

    if (Math.abs(diff) < numItems / 2) {
      moveWheel(diff * itemStep);
    } else {
      const amt = numItems - Math.abs(diff);

      if (current > i) {
        moveWheel(amt * -itemStep);
      } else {
        moveWheel(amt * itemStep);
      }
    }

    onSwitchPeriod(activeItem);
  };

  const moveWheel = (amount: number) => {
    const progress = tl.progress();
    const snapFn = snapRef.current;
    const wrapProgressFn = wrapProgressRef.current;

    if (snapFn && wrapProgressFn) {
      tl.progress(wrapProgressFn(snapFn(tl.progress() + amount)));
      tl.progress(progress);

      gsap.to(tl, {
        progress: snapFn(tl.progress() + amount),
        modifiers: {
          progress: wrapProgressFn
        }
      });
    }
  };

  return(
    <PeriodWheel className="container">
      <div className="wrapper">
        {(periods.length > 0) && periods.map(period => (
          <div
            key={period.id}
            className={`item ${period.id} ${(period.id - 1) === activeIndex? 'active' : ''}`}
            onClick={() => handleClick(periods.indexOf(period))}
          >
            {period.id}
            <span className='item__name'>{period.name}</span>
          </div>
        ))}
        <svg ref={svgRef} viewBox="0 0 300 300">
          <circle id="holder" className="st0" cx="151" cy="151" r="150"/>
        </svg>
      </div>
    </PeriodWheel>
  );
};

export default PeriodCirleSwicth;
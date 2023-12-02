import {FC, useRef, useState, useLayoutEffect} from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Period } from '../../types/Period';
import dot from '../../assets/icons/icon-dot.svg'

const PeriodWheel = styled.div`
  max-width: 500px;

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
      height: 530px;
      aspect-ratio: 1;
      opacity: 0.2;
      overflow: visible;
      z-index: -1;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
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

  gsap.registerPlugin(MotionPathPlugin);

  const [itemsEls, setItemsEls] = useState<HTMLElement[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const trackerRef = useRef<{ item: number }>({ item: 0 });
  const snapRef = useRef<(value: number) => number>();
  const wrapProgressRef = useRef<(value: number) => number>();
  const numItemsRef = useRef<number | null>(null);
  const itemStepRef = useRef<number | null>(null);
  const tl = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true, reversed: true }));

  let wrapTracker: (value: number) => number;

  useLayoutEffect(() => {

    const circlePath = MotionPathPlugin.convertToPath("#holder", false)[0];
    circlePath.id = "circlePath";
    svgRef.current?.prepend(circlePath);

    const items = gsap.utils.toArray('.item') as HTMLElement[];
    setItemsEls(items);
    console.log('items set', items);

    numItemsRef.current = items.length;
    itemStepRef.current = 1 / numItemsRef.current;
    wrapProgressRef.current = gsap.utils.wrap(0, 1);
    snapRef.current = gsap.utils.snap(itemStepRef.current);
    wrapTracker = gsap.utils.wrap(0, numItemsRef.current);
    
    if (items.length > 0) {
      items.forEach((item, i) => {
        gsap.set(item, {
          motionPath: {
            path: circlePath,
            align: circlePath,
            alignOrigin: [0.5, 0.5],
            end: i / items.length,
          },
          scale: 0.9,
        });
      });
    }
    
    tl.current.to(wrapperRef.current, {
      rotation: 360, 
      duration: 1, 
      ease: 'none'
    });

    tl.current.to(items, {
      rotation: "-=360", 
      transformOrigin: 'center center', 
      duration: 1, 
      ease: 'none',
    }, 0);

    tl.current.to(trackerRef, {
      item: numItemsRef.current,
      duration: 1, 
      ease: 'none',
      modifiers: {
        item: value => {
          console.log('error here?');
          return (numItemsRef.current !== null) && wrapTracker(numItemsRef.current - Math.round(value));
        }
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
    console.log('itemStep', itemStepRef.current);

    if (numItemsRef.current !== null && itemStepRef.current !== null) {
      if (Math.abs(diff) < numItemsRef.current / 2) {
        moveWheel(diff * itemStepRef.current);
      } else {
        const amt = numItemsRef.current - Math.abs(diff);

        if (current > i) {
          moveWheel(amt * -itemStepRef.current);
        } else {
          moveWheel(amt * itemStepRef.current);
        }
      }
    }

    onSwitchPeriod(activeItem);
  };

  const moveWheel = (amount: number) => {
    console.log('tl progress', tl.current.progress());

    const progress = tl.current.progress();
    const snapFn = snapRef.current;
    const wrapProgressFn = wrapProgressRef.current;

    if (snapFn && wrapProgressFn) {
      tl.current.progress(wrapProgressFn(snapFn(tl.current.progress() + amount)));
      tl.current.progress(progress);

      gsap.to(tl, {
        progress: snapFn(tl.current.progress() + amount),
        modifiers: {
          progress: gsap.utils.wrap(0, 1)
        }
      });
    }
  };

  return(
    <PeriodWheel className="container">
      <div className="wrapper" ref={wrapperRef}>
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
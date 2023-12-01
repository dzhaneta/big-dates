import {FC, useRef, useState, useLayoutEffect} from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
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
    transition-duration: 1s;
    transition-timing-function: linear;
    transition-delay: 0;

    &:hover {
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
      left: 20px;
      display: none;
      font-size: 20px;
      font-weight: 700;
      line-height: 150%;
    }
  }

  .item.active {
      background-color: blue;

    span {
      display: block;
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

const PeriodCirleSwicth: FC<{ periods: Period[]; }> = ({periods}) => {

  const [itemsEls, setItemsEls] = useState<HTMLElement[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  
  gsap.registerPlugin(MotionPathPlugin);

  let tracker: { item: number } = { item: 0 };
  let numItems: number;
  let itemStep: number;
  let tl: gsap.core.Timeline;
  let wrapTracker: (value: number) => number;
  let wrapProgress: (value: number) => number;
  let snap: (value: number) => number;

  useLayoutEffect(() => {
    console.log('useEffect');
    console.log('switch get', periods);

    const circlePath = MotionPathPlugin.convertToPath("#holder", false)[0];
    circlePath.id = "circlePath";
    svgRef.current?.prepend(circlePath);

    const items = gsap.utils.toArray('.item') as HTMLElement[];
    setItemsEls(items);
    console.log('items set', items);

    numItems = items.length;
    itemStep = 1 / numItems;
    wrapProgress = gsap.utils.wrap(0, 1);
    snap = gsap.utils.snap(itemStep);
    wrapTracker = gsap.utils.wrap(0, numItems);
    
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
    
    tl = gsap.timeline({ paused: true, reversed: true });

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

    tl.to(tracker, {
      item: numItems,
      duration: 1, 
      ease: 'none',
      modifiers: {
        item: value => wrapTracker(numItems - Math.round(value))
      }
    }, 0);
  }, [periods]);

  const handleClick = (id: number) => {
    console.log('tracker', tracker);
    const current = tracker.item;
    const activeItem = id;

    if (id === current) {
      return;
    }

    // set active item to the item that was clicked and remove active class from all items
    const newItems: HTMLElement[] = [...itemsEls];
    newItems[current].classList.remove('active');
    console.log('new active item', newItems);
    newItems[activeItem].classList.add('active');
    setItemsEls(newItems);

    const diff = current - id;

    if (Math.abs(diff) < numItems / 2) {
      moveWheel(diff * itemStep);
    } else {
      const amt = numItems - Math.abs(diff);

      if (current > id) {
        moveWheel(amt * -itemStep);
      } else {
        moveWheel(amt * itemStep);
      }
    }
  };

  const moveWheel = (amount: number) => {
    console.log('moveWheel', tl);
    const progress = tl.progress();
    tl.progress(wrapProgress(snap(tl.progress() + amount)));
    const next = tracker.item;
    tl.progress(progress);

    const newItems = [...itemsEls];
    newItems[next].classList.remove('active');
    newItems[next].classList.add('active');
    setItemsEls(newItems);

    gsap.to(tl, {
      progress: snap(tl.progress() + amount),
      modifiers: {
        progress: wrapProgress
      }
    });
  };

  return(
    <PeriodWheel className="container">
      <div className="wrapper">
        {(periods.length > 0) && periods.map(period => (
          <div
            key={period.id}
            className={`item ${period.id} ${period.id ===1? 'active' : ''}`}
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
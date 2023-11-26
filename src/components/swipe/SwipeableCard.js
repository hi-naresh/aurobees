import React, { useRef, useCallback, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './SwipeableCard.css'; // Make sure to create this CSS file

const physics = {
  touchResponsive: { friction: 50, tension: 2000 },
  animateOut: { friction: 30, tension: 400 },
  animateBack: { friction: 10, tension: 200 }
};

const SwipeableCard = ({ children, onSwipe, onCardLeftScreen }) => {
  const [{ xyrot }, setSpringTarget] = useSpring(() => ({
    xyrot: [0, 0, 0],
    config: physics.touchResponsive
  }));

  const cardRef = useRef();

  const handleSwipeReleased = useCallback(async (gesture) => {
    const swipeThreshold = 0.5; // Adjust as needed
    const direction = gesture.dx > swipeThreshold ? 'right' : 'left';
    onSwipe(direction);
    await animateOut(gesture, setSpringTarget);
    onCardLeftScreen(direction);
  }, [onSwipe, onCardLeftScreen, setSpringTarget]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    let startX = 0;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const onTouchMove = (e) => {
      const currentX = e.touches[0].clientX;
      const dx = currentX - startX;
      setSpringTarget.start({ xyrot: [dx, 0, dx / 10] }); // Adjust rotation factor as needed
    };

    const onTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      handleSwipeReleased({ dx: endX - startX });
      setSpringTarget.start({ xyrot: [0, 0, 0] });
    };

    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchmove', onTouchMove);
    element.addEventListener('touchend', onTouchEnd);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleSwipeReleased, setSpringTarget]);

  const animateOut = async (gesture, setSpringTarget) => {
    // Define the animation logic for swiping out the card
    // For simplicity, we use a basic animation here
    const power = 1.3; // Adjust as needed
    const finalX = gesture.dx > 0 ? power * 200 : -power * 200; // Adjust as needed
    const finalRotation = finalX / 10; // Adjust as needed

    return new Promise((resolve) => {
      setSpringTarget.start({
        xyrot: [finalX, 0, finalRotation],
        config: physics.animateOut,
        onRest: resolve
      });
    });
  };

  return (
    <animated.div
      ref={cardRef}
      className="swipeable-card"
      style={{
        transform: xyrot.to((x, y, rot) => `translate3d(${x}px, ${y}px, 0px) rotate(${rot}deg)`)
      }}
    >
      {children}
    </animated.div>
  );
};

export default SwipeableCard;

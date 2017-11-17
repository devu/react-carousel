import React from 'react';
import PropTypes from 'prop-types';

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.checkBreakpointss = this.checkBreakpoints.bind(this);
    this.debbounce = this.debbounce.bind(this);
    this.onResize = this.debbounce(this.onResize.bind(this), 100);

    this.breakpoint = this.checkBreakpointss();
    const items = this.props.options.responsive[this.breakpoint].items;
    const mIndex = props.options.index;
    this.itemWidth = props.options.itemWidth || 220;
    this.sensitivity = props.options.sensitivity || 10;
    this.speed = props.options.speed || 1;
    this.children = [];

    this.state = {
      index: mIndex || 0,
      itemId: mIndex,
      children: [],
      isMoving: false,
      numItems: items,
      maxWidth: this.itemWidth * items,
      mouseDownPosition: {
        x: 0,
        xOffset: -mIndex * this.itemWidth
      }
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.slideTo = this.slideTo.bind(this);

    this.renderItems = this.renderItems.bind(this);

    this.prev = (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 64 64" 
        width="64" 
        height="64" 
        fill="currentcolor"
      >
        <path d="M24 32 L40 48 L40 44 L28 32 L40 20 L40 16 Z" />
      </svg>);

    this.next = (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 64 64" 
        width="64" 
        height="64" 
        fill="currentcolor"
      >
        <path d="M36 32 L24 44 L24 48 L40 32 L24 16 L24 20 Z" />
      </svg>);
  }

  componentWillMount() {
    this.setState({
      maxWidth: this.state.numItems * this.itemWidth
    });
  }

  componentDidMount() {
    this.children = this.carouselContent.childNodes;
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('resize', this.onResize);

    const pos = -this.state.index * this.itemWidth;
    this.slideTo(pos, 1);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    const use = this.checkBreakpoints();
    if (use !== this.breakpoint) {
      this.breakpoint = use;
      const items = this.props.options.responsive[use].items;
      this.setState({ 
        numItems: items,
        maxWidth: items * this.itemWidth
      });
    }
  }

  onMouseDown(e) {
    const position = this.getControlPosition(e);
    this.setState({
      mouseDownPosition: {
        x: position.clientX - this.state.mouseDownPosition.xOffset
      },
      isMoving: true,
      target: e.target
    });
  }

  onMouseUp(e) {
    if (this.state.isMoving) {
      const initial = this.state.mouseDownPosition;
      const position = this.getControlPosition(e);
      const xOffset = position.clientX - initial.x;
      const itemWidth = this.children[this.state.index].offsetWidth;

      let mIndex = Math.round(xOffset / itemWidth);
      if (mIndex > 0) { 
        mIndex = 0;
      } else if (mIndex < 1 - this.children.length) {
        mIndex = 1 - this.children.length;
      }
      const moveX = mIndex * itemWidth;
      this.slideTo(moveX, this.speed);
      const id = e.target.getAttribute('data-item-id');
      
      this.setState({
        isMoving: false,
        target: e.target,
        index: -mIndex,
        itemId: id,
        mouseDownPosition: {
          xOffset: moveX
        }
      });
    }
  }

  onTouchStart(e) {
    e.preventDefault();
    this.onMouseDown(e.changedTouches[0]);
  }

  onTouchEnd(e) {
    e.preventDefault();
    this.onMouseUp(e.changedTouches[0]);
  }

  onTouchMove(e) {
    e.preventDefault();
    this.onMouseMove(e.changedTouches[0]);
  }

  onMouseMove(e) {
    if (this.state.isMoving) {
      const initial = this.state.mouseDownPosition;
      const position = this.getControlPosition(e);
      if (Math.abs(position.clientX - initial.x) >= this.sensitivity) {
        const xPos = position.clientX - initial.x;
        this.slideTo(xPos, 0);
      }
    }
  }

  getControlPosition(e) {
    const position = (e.changedTouches && e.changedTouches[0]) || e;
    return {
      clientX: position.clientX
    };
  }

  slideTo(pos, speed) {
    this.carouselContent.style = `
    transition: transform ${speed}s;
    transform: translate3d(${pos}px, 0px, 0px)`;
  }

  checkBreakpoints() {
    let b = 0;
    Object.keys(this.props.options.responsive).forEach((breakpoint) => {
      if (window.innerWidth > breakpoint) {
        b = breakpoint;
      } else if (window.innerWidth <= breakpoint) {
        return b;
      }
      return breakpoint;
    });

    return b;
  }

  debbounce(func, wait) {
    let timeout;
    return function bounce() {
      const context = this;
      const later = function back() {
        timeout = null;
        func.apply(context);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  renderItems() {
    return this.props.items.map((item, i) => {
      const isSelected = (i === this.state.index) ? 'selected' : '';
      return (
        <div 
          data-item-id={i} 
          key={`item${i}!`} 
          className={`carousel-item ${isSelected}`}
          style={{ width: 'auto' }}
        >
          <div className="item-content">{item}</div>
        </div>
      );
    });
  }

  render() {
    const items = this.renderItems();
    // console.log('render');
    return (
      <div 
        className="carousel-container" 
        onMouseMove={this.onMouseMove}
        onTouchMove={this.onTouchMove}
      >
        <div className="carousel-nav">
          <div className="prev">{this.prev}</div>
        </div>
        <div 
          className="carousel-slider" 
          style={{ width: `${this.state.maxWidth}px` }}
        >
          <div 
            className="carousel-content"
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
            ref={(carouselContent) => { this.carouselContent = carouselContent; }}
          >
            {items}
          </div>
        </div>
        <div className="carousel-nav">
          <div className="next">{this.next}</div>
        </div>
      </div>
    );
  }
}

Carousel.propTypes = {
  items: PropTypes.array,
  index: PropTypes.number,
  options: PropTypes.object,
  numItems: PropTypes.number
};

export default Carousel;

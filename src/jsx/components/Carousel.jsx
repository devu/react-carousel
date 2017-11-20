import React from 'react';
import PropTypes from 'prop-types';

const Options = {
  index: 0,
  navTop: 0,
  padding: 10,
  itemWidth: 100,
  sensitivity: 10,
  speed: 1,
  responsive: {
    items: 0
  }
};

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.checkBreakpointss = this.checkBreakpoints.bind(this);
    this.getMaxItemWidth = this.getMaxItemWidth.bind(this);
    this.debounce = this.debounce.bind(this);
    this.onResize = this.debounce(this.onResize.bind(this), 100);

    const mIndex = props.index;
    Options.padding = props.options.padding;
    this.itemWidth = props.options.itemWidth || this.getMaxItemWidth() + (Options.padding * 2);
    this.sensitivity = props.options.sensitivity || 10;
    this.speed = props.options.speed || 1;
    this.children = [];

    this.breakpoint = this.checkBreakpointss();
    const items = this.props.options.responsive[this.breakpoint].items;
    const itemsOffset = this.props.options.responsive[this.breakpoint].offset;
    this.itemsOffset = itemsOffset * this.itemWidth;

    this.state = {
      index: props.index,
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
    this.nextItem = this.nextItem.bind(this);
    this.prevItem = this.prevItem.bind(this);
    this.updateItem = this.updateItem.bind(this);

    this.renderItems = this.renderItems.bind(this);

    this.prevEnabled = 'disabled';
    this.prev = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="currentcolor">
        <path d="M24 32 L40 48 L40 44 L28 32 L40 20 L40 16 Z" />
      </svg>);

    this.nextEnabled = 'enabled';
    this.next = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="currentcolor">
        <path d="M36 32 L24 44 L24 48 L40 32 L24 16 L24 20 Z" />
      </svg>);
  }
  /*
  componentWillMount() {
    this.setState({
      maxWidth: this.state.numItems * this.itemWidth
    });
  }*/

  componentDidMount() {
    this.children = this.carouselContent.childNodes;
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('resize', this.onResize);

    console.log('componentDidMount', this.state.index);
    const pos = -this.state.index * this.itemWidth;
    this.slideTo(pos, 1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.index !== this.state.index) {
      this.updateItem(nextProps.index);
    }
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
      const itemsOffset = this.props.options.responsive[use].offset;
      this.itemsOffset = itemsOffset * this.itemWidth;
      this.setState({
        numItems: items,
        maxWidth: items * this.itemWidth
      });

      this.slideTo(this.state.mouseDownPosition.xOffset, this.speed);
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
      // const itemWidth = this.children[this.state.index].offsetWidth;
      const mIndex = Math.round(xOffset / this.itemWidth);
      this.setState({ isMoving: false });

      if (mIndex <= 0) {
        const max = this.children.length - 1;
        this.updateItem((-mIndex < max) ? -mIndex : max);
      } else {
        this.updateItem(0);
      }
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

  getMaxItemWidth() {
    let width = 1;
    this.props.items.forEach((item) => {
      const w = parseInt(item.props.style.width, 10);
      if (w > width) {
        width = w;
      }
    });

    return width;
  }

  slideTo(pos, speed) {
    this.carouselContent.style = `
    left: ${this.itemsOffset}px;
    transition: transform ${speed}s;
    transform: translate3d(${pos}px, 0px, 0px);`;
  }

  nextItem() {
    if (this.state.index < this.children.length - 1) {
      const mIndex = this.state.index + 1;
      this.updateItem(mIndex);
    }
  }

  prevItem() {
    if (this.state.index > 0) {
      const mIndex = this.state.index - 1;
      this.updateItem(mIndex);
    }
  }

  updateItem(i) {
    console.log('updateItem', i);
    const moveX = -i * this.itemWidth;
    this.slideTo(moveX, this.speed);
    const id = parseInt(this.children[i].getAttribute('data-item-id'), 10);

    if (this.state.index !== i) {
      this.props.onChanged(id);

      this.setState({
        index: i,
        itemId: -id,
        mouseDownPosition: {
          xOffset: moveX
        }
      });

      this.prevEnabled = (i === 0) ? 'disabled' : 'enabled';
      this.nextEnabled = (i === (this.children.length - 1)) ? 'disabled' : 'enabled';
    }
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

  debounce(func, wait) {
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
          style={{ width: 'auto', padding: `${Options.padding}px` }}
        >
          <div className="item-content">{item}</div>
        </div>
      );
    });
  }

  render() {
    const items = this.renderItems();
    console.log('Carousel render');
    return (
      <div className={`carousel-container ${this.props.className}`} onMouseMove={this.onMouseMove} onTouchMove={this.onTouchMove}>

        <div className="carousel-nav">
          <div className={`prev ${this.prevEnabled}`} onTouchStart={this.prevItem} onClick={this.prevItem}>
            {this.prev}
          </div>
          <div className={`next ${this.nextEnabled}`} onTouchStart={this.nextItem} onClick={this.nextItem}>
            {this.next}
          </div>
        </div>

        <div className="carousel-slider" style={{ width: `${this.state.maxWidth}px` }}>
          <div className="carousel-content" onMouseDown={this.onMouseDown} onTouchStart={this.onTouchStart} ref={(ctn) => { this.carouselContent = ctn; }}>
            {items}
          </div>
        </div>

      </div>
    );
  }
}

Carousel.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
  index: PropTypes.number,
  options: PropTypes.object,
  numItems: PropTypes.number,
  onChanged: PropTypes.func
};

export default Carousel;

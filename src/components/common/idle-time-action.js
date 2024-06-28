import { Component } from 'react';
import PropTypes from 'prop-types';

import { isEmpty } from 'utils';

const IS_BROWSER =
  (typeof window === 'undefined' ? 'undefined' : typeof window) === 'object';

const DEFAULT_ELEMENT = IS_BROWSER ? document : {};

const DEFAULT_EVENTS = [
  'keydown',
  'wheel',
  'DOMMouseScroll',
  'mouseWheel',
  'mousedown',
  'touchstart',
  'touchmove',
  'MSPointerDown',
  'MSPointerMove',
];

let idleTime = 0,
  idleTimeIntervel = null;

class IdleTimeAction extends Component {
  static defaultProps = {
    time: 5,
    events: DEFAULT_EVENTS,
    element: DEFAULT_ELEMENT,
  };

  componentDidMount = () => {
    this.registerEvents();
  };

  registerEvents = () => {
    const { element, events } = this.props;

    events.forEach((e) => {
      element.addEventListener(e, this.handleEvent);
    });
  };

  handleEvent = () => {
    // This method later can be used for
    // handling other logics
    this.resetIdleTime();
  };

  resetIdleTime = () => {
    idleTime = 0;
  };

  resetTimeInterval = () => {
    this.resetIdleTime();
    clearInterval(idleTimeIntervel);
    idleTimeIntervel = null;
  };

  handleAction = () => {
    const { action, time } = this.props;

    idleTimeIntervel = setInterval(() => {
      idleTime++;

      if (idleTime === time) {
        action();
        this.resetTimeInterval();
      }
    }, 60000);
  };

  render() {
    const { children, isAuthenticated } = this.props;

    if (isAuthenticated) {
      if (isEmpty(idleTimeIntervel)) {
        this.handleAction();
      }
    } else {
      this.resetTimeInterval();
    }

    return children || null;
  }
}

IdleTimeAction.propTypes = {
  action: PropTypes.func,
  time: PropTypes.number,
  events: PropTypes.array,
  element: PropTypes.object,
  children: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

export default IdleTimeAction;
